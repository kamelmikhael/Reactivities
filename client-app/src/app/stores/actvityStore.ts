import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity.model";
import { format } from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b)=> 
            a.date!.getTime() - b.date!.getTime()
        );
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    setActivityRegistry = (activity: Activity) => {
        this.activityRegistry.set(activity.id, activity);
    }

    deleteActivityRegistry = (id: string) => {
        this.activityRegistry.delete(id);
    }

    setSelectedActivity = (state: Activity | undefined) => {
        this.selectedActivity = state;
    }

    setEditMode = (state: boolean) => {
        this.editMode = state;
    }

    setLoading = (state: boolean) => {
        this.loading = state;
    }
    
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                this.setActivity(activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id:string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.setSelectedActivity(activity);
        } else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.setSelectedActivity(activity);
            } catch (error) {
                console.log(error);
            } finally {
                this.setLoadingInitial(false);
            }
        }
        return activity;
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if(user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            );
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees!.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!); // activity.date.split('T')[0];
        this.setActivityRegistry(activity);
    }

    private getActivity = (id: string): Activity | undefined => {
        return this.activityRegistry.get(id);
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);
            
            // handle state after success
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];

            this.setActivity(newActivity);
            this.setSelectedActivity(newActivity);
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            // handle state after success
            if(activity.id) {
                let updatedActivity = {...this.getActivity(activity.id), ...activity};
                
                this.setActivityRegistry(updatedActivity as Activity);
                this.setSelectedActivity(updatedActivity as Activity);
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);

        try {
            await agent.Activities.delete(id);
            // handle state after success
            this.deleteActivityRegistry(id);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.setLoading(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if(this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(x => x.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.setActivityRegistry(this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    cancelActivityToggle = async () => {
        this.setLoading(true);
        try {
            await agent.Activities.attend(this.selectedActivity!.id);

            this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
            this.setActivityRegistry(this.selectedActivity!);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
}