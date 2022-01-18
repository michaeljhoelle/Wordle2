import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WordClient {
  constructor(private http: HttpClient) {
  }
  headers: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'});
  url = "https://api.memecenter.org";

  verifyWord(word: string) {
    return this.http.get<number[]>(this.url + "/words/verify/" + word, {headers: this.headers});
  }
}
