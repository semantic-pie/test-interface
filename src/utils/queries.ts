import { GET_TRACK_DATA_URL } from "../config";
import { Track } from "./interfaces";

export const fetchTracks = async (page: number, limit: number): Promise<Track[]> => {
return fetch(GET_TRACK_DATA_URL + `?page=${page}&limit=${limit}`)
.then(data => data.json())
}
 