export class Stat{
    
    constructor(
        private name: string,
        private value: number
    ){}

    getName():string{
        return this.name;
    }

    getVakue():number{
        return this.value;
    }

}