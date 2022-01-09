import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity.model";
import { v4 as uuid } from 'uuid';

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
        try {
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.setActivityRegistry(activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingInitial(false);
        }
    }

    selectActivity = (id: string) => {
        const selectedActivity = this.activityRegistry.get(id);
        this.setSelectedActivity(selectedActivity);
    }

    cancelSelectActivity = () => {
        this.setSelectedActivity(undefined);
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.setEditMode(true);
    }

    closeForm = () => {
        this.setEditMode(false);
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true);

        activity.id = uuid();

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
            if(this.selectedActivity?.id === id) {
                this.cancelSelectActivity();

                if(this.editMode === true) this.setEditMode(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }
}