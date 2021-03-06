import axios, {AxiosResponse} from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => 
{
    return new Promise((resolve) => 
        setTimeout(resolve, delay)
    );
}

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const rquests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
   list: () => rquests.get<Activity[]>('/activities'),
   deatails: (id:string) => rquests.get<Activity>(`/activities/${id}`),
   create: (activity: Activity) => rquests.post<void>('/activities/', activity),
   update: (activity: Activity) => rquests.put<void>(`/activities/${activity.id}`, activity),
   delete: (id:string) => rquests.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;