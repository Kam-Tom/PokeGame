export enum PokemonType
{
    None,
    Normal,
    Flying
}
export class Pokemon
{
    constructor(
        private secretId:number,
        private id:number,
        private name:string,
        private generation: number,
        private mainType: PokemonType,
        private secondType: PokemonType,
        private attack?: number,
        private defense?: number
        ) {}
    
    get SecretId():number {return this.secretId};
    get Id():number {return this.id};
    get Name():string {return this.name};
    get Generation():number {return this.generation};
    get MainType():PokemonType {return this.mainType};
    get SecondType():PokemonType {return this.secondType};
    get Attack():number {return this.attack};
    get Defense():number {return this.defense};
    get DiscoveryProcentage():number
    {
        let v:number = 0;
        if(this.Id)
            v += 0.33;
        if(this.Name)
            v += 0.33;
        if(this.Generation)
            v += 0.34;
        return v;
    }
}