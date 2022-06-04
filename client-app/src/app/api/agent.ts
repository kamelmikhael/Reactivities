import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { environment } from "../../environment";
import { Activity, ActivityFormValues } from "../models/activity.model";
import { Photo, Profile } from "../models/profile";
import { ProfileUpdate } from "../models/profileUpdate.model";
import { User, UserFormValues } from "../models/user.model";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

axios.defaults.baseURL = environment.apiBaseUrl;

// axios interceptors request for token and Authorization
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token) config!.headers!.Authorization = `Bearer ${token}`;
    return config;
})

// axios interceptors response for error handling
axios.interceptors.response.use(async (response) => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response!;
    switch(status) {
        case 400: // bad request
            if(typeof data === 'string') {
                toast.error(data);
            }
            else if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            else if(data.errors) { // validation's errors
                const modalStateErrors = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                toast.error('Validation error');
                throw modalStateErrors.flat();
            }
            break;
        case 401: // un-authorized
            toast.error('Unauthorized');
            break;
        case 404: // not-found
            toast.error('Not Found');
            history.push('/not-found');
            break;
        case 500: // server error
            toast.error('Server Error');
            store.commonStore.setServerError(data);
            history.push('/server-error')
            break;
    }
    return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// Activities Controller methods
const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>(`/activities`, activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

// Account Controller methods
const Account = {
    currentUser: () => requests.post<User>('/account/current-user', {}),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

// Profiles Controller methods
const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (photo: Blob) => {
        let formData = new FormData();
        formData.append('file', photo);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: ProfileUpdate) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    getFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`)
} 

const agent = {
    Activities,
    Account,
    Profiles,
}

export default agent;