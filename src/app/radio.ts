export class Radio {
    num : string;
    name : string;
    url : string;
    imgPreview : string;
    frequence : string;
    contry : string;

    constructor(num: string, name: string, url:string, imgPreview:string, frequence:string, contry:string){
        this.num = num;
        this.name = name;
        this.url = url;
        this.imgPreview = imgPreview;
        this.frequence = frequence;
        this.contry = contry;
    }
}
