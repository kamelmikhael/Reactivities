import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserActivity } from "../models/profile";
import { ProfileUpdate } from "../models/profileUpdate.model";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings: boolean = false;
    activeTab: number = 0;
    userActivities: UserActivity[] = [];
    loadingUserActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'followings';
                    this.loadFollowings(predicate);
                } else {
                    this.setFollowings([]);
                }
            }
        )
    }

    get isCurrentUser() {
        if(store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    setActiveTab = (status: any) => {
        this.activeTab = status;
    }

    setProfile = (status: Profile | null) => {
        this.profile = status;
    }

    setLoadingProfile = (status: boolean) => {
        this.loadingProfile = status;
    }

    setUploading = (status: boolean) => {
        this.uploading = status;
    }

    setLoading = (status: boolean) => {
        this.loading = status;
    }

    setUserActivities = (state: UserActivity[]) => {
        this.userActivities = state;
    }

    setLoadingUserActivities = (state: boolean) => {
        this.loadingUserActivities = state;
    }

    loadProfile =async (username: string) => {
        this.setLoadingProfile(true);
        try {
            const profile = await agent.Profiles.get(username);
            this.setProfile(profile);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingProfile(false);
        }
    }

    uploadPhoto =async (photo: Blob) => {
        this.setUploading(true);
        try {
            const response = await agent.Profiles.uploadPhoto(photo);
            const uploadedPhoto = response.data;
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos?.push(uploadedPhoto);

                    if(uploadedPhoto.isMain && store.userStore.user) {
                        store.userStore.setMainImage(uploadedPhoto.url);
                        this.profile.image = uploadedPhoto.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setUploading(false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.setLoading(true);
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setMainImage(photo.url);
            runInAction(() => {
                if(this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.setLoading(true);
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if(this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    updateProfile =async (profile: ProfileUpdate) => {
        this.setLoading(true);
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if(profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = {...this.profile, ...profile as Profile};
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.setLoading(true);
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFolowing(username);
            runInAction(() => {
                if(this.profile 
                    && this.profile.username !== store.userStore.user?.username
                    && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if(this.profile
                    && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingsCount++ : this.profile.followingsCount--;
                }
                this.followings.forEach(profile => {
                    if(profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoading(false);
        }
    }

    setLoadingFollowings = (status: boolean) => {
        this.loadingFollowings = status;
    }

    setFollowings = (status: Profile[]) => {
        this.followings = status;
    }

    loadFollowings = async (predicate: string) => {
        this.setLoadingFollowings(true);
        try {
            const followings = await agent.Profiles.getFollowings(this.profile!.username, predicate);
            this.setFollowings(followings);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingFollowings(false);
        }
    }

    loadUserActivities = async (username: string, predicate?: string) => {
        this.setLoadingUserActivities(true);
        try {
            const activities = await agent.Profiles.listActivities(username, predicate);
            this.setUserActivities(activities);
        } catch (error) {
            console.log(error);
        } finally {
            this.setLoadingUserActivities(false);
        }
    }
}