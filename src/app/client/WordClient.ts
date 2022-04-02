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

  verifyWord(word: string, password: any) {
    let path = this.url + "/words/verify/" + word
    if (password) {
      path = path.concat("?password=" + password)
    }
    return this.http.get<number[]>(path, {headers: this.headers});
  }
}
