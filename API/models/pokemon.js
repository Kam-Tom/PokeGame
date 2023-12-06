export default class Pokemon
{
    constructor(id,name,generation,attack,defense,mainType,secondType)
    {
        this.id = id;
        this.name = name;
        this.generation = generation;
        this.attack = attack;
        this.defense = defense;
        this.mainType = mainType;
        this.secondType = secondType;
    }
}