import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity.model";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b)=> 
            Date.parse(a.date) - Date.parse(b.date)
        );
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
        activity.date = activity.date.split('T')[0];
        this.setActivityRegistry(activity);
    }

    private getActivity = (id: string): Activity | undefined => {
        return this.activityRegistry.get(id);
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true);

        try {
            await agent.Activities.create(activity);
            // handle state after success
            this.setActivityRegistry(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true);

        try {
            await agent.Activities.update(activity);
            // handle state after success
            this.setActivityRegistry(activity);
            this.setSelectedActivity(activity);
            this.setEditMode(false);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
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
}