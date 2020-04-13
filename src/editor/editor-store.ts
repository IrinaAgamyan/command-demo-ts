import {CSSProperties} from "react";
import {BehaviorSubject} from "rxjs";

class Store {
    public data$: BehaviorSubject<string> = new BehaviorSubject<string>('text');
    public selection: string | null = null;
    public clipboard: string | null = null;
    public styles$: BehaviorSubject<CSSProperties> = new BehaviorSubject<CSSProperties>({});
}

const EditorStore = new Store();

export default EditorStore;
