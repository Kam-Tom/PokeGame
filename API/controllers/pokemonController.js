import UserPokemon from '../models/userPokemon.js';
import * as db from '../services/database.js';
import axios from 'axios';
import sharp from'sharp';
import leven from'leven';

let pokemonIdMapper = [632, 624, 498, 58, 943, 474, 651, 207, 334, 4, 700, 883, 952, 90, 132, 534, 967, 935, 619, 696, 366, 133, 373, 312, 583, 753, 179, 492, 1016, 54, 362, 898, 811, 428, 649, 748, 478, 844, 762, 410, 41, 982, 466, 603, 380, 882, 798, 1, 541, 887, 576, 867, 197, 198, 648, 836, 620, 158, 375, 665, 660, 727, 237, 414, 761, 878, 101, 129, 863, 16, 219, 942, 635, 377, 791, 544, 304, 10, 44, 468, 185, 134, 246, 919, 349, 501, 884, 723, 622, 107, 102, 680, 150, 465, 981, 419, 891, 268, 564, 442, 456, 168, 661, 275, 330, 833, 494, 558, 599, 395, 572, 853, 316, 163, 892, 772, 181, 707, 359, 258, 348, 814, 613, 596, 969, 897, 159, 557, 579, 837, 379, 747, 676, 12, 780, 535, 556, 13, 905, 96, 958, 354, 901, 520, 303, 1008, 383, 728, 235, 948, 628, 984, 136, 904, 392, 521, 195, 955, 998, 711, 880, 979, 548, 972, 488, 476, 291, 199, 32, 170, 496, 591, 397, 143, 119, 77, 440, 458, 845, 280, 963, 122, 39, 537, 33, 497, 350, 239, 694, 992, 125, 469, 130, 916, 106, 573, 645, 443, 756, 215, 627, 1006, 647, 31, 37, 796, 560, 231, 758, 22, 462, 453, 331, 482, 69, 677, 1004, 71, 385, 425, 408, 21, 374, 187, 344, 785, 240, 766, 399, 321, 951, 436, 97, 563, 895, 536, 944, 184, 19, 920, 953, 978, 131, 588, 404, 124, 812, 281, 326, 1013, 204, 292, 519, 567, 988, 736, 807, 325, 611, 970, 481, 932, 531, 183, 623, 60, 145, 284, 856, 194, 595, 703, 233, 765, 719, 712, 188, 746, 55, 346, 317, 815, 808, 116, 640, 721, 693, 148, 114, 282, 775, 899, 265, 234, 309, 320, 705, 964, 53, 470, 886, 299, 615, 803, 315, 788, 165, 559, 307, 147, 81, 173, 877, 773, 848, 63, 306, 674, 267, 914, 752, 192, 605, 103, 829, 921, 288, 217, 977, 406, 174, 975, 673, 211, 908, 420, 302, 345, 123, 876, 353, 297, 973, 252, 838, 455, 142, 643, 515, 924, 213, 810, 698, 545, 582, 446, 155, 50, 634, 540, 769, 89, 43, 888, 744, 390, 336, 941, 729, 679, 776, 434, 491, 907, 162, 238, 25, 621, 657, 866, 271, 46, 990, 609, 580, 422, 672, 715, 249, 471, 424, 960, 546, 713, 792, 247, 214, 135, 423, 449, 626, 551, 305, 113, 533, 157, 841, 121, 489, 925, 45, 378, 169, 835, 340, 243, 524, 787, 575, 370, 193, 555, 767, 314, 890, 667, 220, 221, 881, 272, 261, 902, 332, 47, 834, 285, 995, 751, 372, 66, 137, 339, 997, 323, 241, 368, 108, 832, 111, 768, 638, 802, 991, 14, 543, 966, 196, 426, 327, 617, 554, 831, 1001, 153, 650, 15, 789, 923, 412, 257, 295, 182, 75, 236, 630, 827, 738, 1014, 206, 687, 957, 653, 149, 733, 260, 417, 48, 514, 726, 290, 80, 783, 547, 254, 23, 874, 452, 654, 532, 669, 293, 289, 757, 74, 823, 429, 947, 427, 777, 164, 763, 717, 200, 965, 79, 526, 879, 393, 450, 67, 843, 11, 616, 819, 245, 817, 203, 989, 229, 175, 448, 999, 30, 855, 697, 88, 57, 117, 918, 911, 413, 367, 341, 577, 210, 826, 527, 922, 658, 690, 52, 329, 401, 585, 644, 912, 790, 937, 824, 709, 799, 6, 662, 574, 177, 472, 171, 639, 816, 286, 985, 552, 594, 178, 779, 652, 308, 692, 26, 656, 885, 391, 688, 277, 633, 17, 120, 78, 893, 793, 1010, 702, 140, 138, 516, 283, 298, 730, 663, 852, 360, 722, 487, 301, 415, 376, 156, 382, 495, 227, 505, 593, 745, 511, 333, 250, 945, 338, 347, 212, 34, 444, 642, 356, 259, 797, 701, 381, 296, 636, 983, 786, 749, 322, 479, 708, 473, 961, 859, 522, 251, 699, 83, 586, 411, 389, 539, 223, 915, 7, 607, 87, 994, 529, 51, 409, 503, 276, 73, 1005, 913, 335, 974, 528, 100, 244, 29, 42, 584, 936, 242, 928, 76, 490, 949, 186, 357, 742, 724, 172, 755, 82, 403, 369, 754, 263, 821, 262, 671, 127, 860, 433, 431, 278, 858, 517, 85, 861, 681, 224, 486, 934, 59, 608, 750, 342, 683, 795, 216, 903, 906, 689, 518, 70, 704, 475, 105, 287, 1002, 510, 166, 565, 438, 604, 900, 358, 110, 684, 637, 62, 670, 27, 294, 590, 549, 706, 61, 600, 447, 778, 269, 279, 513, 319, 232, 655, 954, 714, 896, 396, 996, 151, 139, 910, 801, 477, 68, 318, 685, 732, 946, 825, 873, 589, 806, 459, 230, 248, 28, 610, 387, 126, 115, 686, 561, 842, 862, 813, 152, 464, 566, 445, 2, 451, 405, 606, 146, 940, 641, 743, 917, 190, 324, 737, 993, 343, 601, 1003, 691, 20, 49, 86, 956, 480, 720, 800, 222, 740, 659, 716, 889, 255, 868, 457, 840, 971, 959, 847, 980, 976, 625, 987, 386, 209, 805, 18, 64, 218, 461, 578, 508, 538, 439, 180, 371, 311, 872, 84, 794, 725, 432, 571, 629, 109, 72, 581, 986, 99, 201, 1011, 739, 128, 929, 351, 666, 364, 1009, 828, 310, 483, 38, 226, 930, 352, 400, 430, 499, 734, 1012, 202, 454, 407, 865, 463, 1017, 435, 598, 9, 735, 781, 112, 36, 864, 93, 938, 612, 274, 718, 569, 441, 760, 857, 592, 300, 962, 950, 675, 710, 854, 92, 484, 467, 774, 507, 968, 869, 104, 1007, 154, 909, 875, 253, 770, 553, 682, 512, 94, 160, 485, 355, 550, 782, 363, 144, 602, 361, 933, 270, 5, 931, 759, 820, 926, 530, 764, 35, 1015, 191, 256, 502, 167, 225, 161, 500, 3, 818, 141, 118, 40, 894, 839, 506, 597, 809, 870, 208, 95, 731, 394, 460, 313, 562, 542, 91, 741, 402, 205, 939, 695, 646, 24, 365, 437, 273, 570, 525, 664, 849, 771, 416, 822, 98, 614, 421, 850, 668, 618, 504, 493, 1000, 871, 264, 587, 176, 228, 388, 189, 846, 418, 337, 65, 927, 678, 830, 568, 784, 523, 851, 509, 8, 384, 266, 804, 631, 328, 56, 398]

export const getPokemonImg = async (req,res) =>
{
    let username = req.body.username;
    let secretId = pokemonIdMapper[req.params.secretId-1];
    let resolution = parseInt(req.body.resolution) || parseInt(req.query.resolution);

    let defaultImage
    try 
    {
        defaultImage = await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secretId}.png`, { responseType: 'arraybuffer' });
    }
    catch
    {
        return res.status(404).send();
    }
    
    let image;
    
    let blacked = true;
    let userPokemons = db.getUserPokemons(username);
    for(let pokemon of userPokemons)
    {
        if(pokemon.secretId === req.params.secretId && pokemon.name)
        {
            blacked = false;
            break;
        }
    }

    if(blacked)
        image = await sharp(defaultImage.data)
            .resize(resolution,resolution)
            .linear(0, 0)
            .toBuffer();
    else
        image = await sharp(defaultImage.data)
            .resize(resolution,resolution)
            .toBuffer();


    res.set('Content-Type', 'image/png');
    res.status(200).send(image);
    
}

export const getUserPokemon = (req,res) =>
{

    let username = req.body.username;
    let secretId = req.params.secretId;

    let userPokemons = db.getUserPokemons(username);
    let userPokemon = new UserPokemon(secretId,"","","","","");
    for(let pokemon of userPokemons)
    {
        if(pokemon.secretId === secretId)
        {
            userPokemon = pokemon;
            break;
        }
    }

    res.status(200).json(userPokemon);

}

const compareNames = (str1, str2) =>
{
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    let tolerance = 0.1;
    let maxDiff = Math.round(str1.length * tolerance);
    return leven(str1,str2) <= maxDiff; 
}

export const updatePokemon = (req,res) =>
{
    let username = req.body.username;
    let secretId = req.params.secretId;
    
    let id = req.body.id;
    let name = req.body.name;
    let generation = req.body.generation;
    let mainType = req.body.mainType;
    let secondType = req.body.secondType;


    let pokemons = db.getPokemons();
    let userPokemons = db.getUserPokemons(username);

    let userPokemon;
    for(let pokemon of userPokemons)
    {
        if(pokemon.secretId === secretId)
            userPokemon = pokemon;
    }
    
    if(!userPokemon)
    {
        userPokemon = new UserPokemon(secretId,"","","","","");
        userPokemons.push(userPokemon);
        res.status(201).json({message:"Created pokemon"});
    }
    else
        res.status(200).json({message:"Updated pokemon"});


    let userData = db.getUserData(username);

    for(let pokemon of pokemons)
    { 
        if(pokemon.id == pokemonIdMapper[userPokemon.secretId-1])
        {
            if(pokemon.id == id)
            {
                userPokemon.id = pokemon.id;
                userData.gen1Score[0] ++;
            }

            if(compareNames(pokemon.name,name))
            {
                userPokemon.name = pokemon.name;
                userData.gen1Score[1] ++;
            }

            if(pokemon.generation == generation)
            {
                userPokemon.generation = pokemon.generation;
                userData.gen1Score[2] ++;
            }

            if(pokemon.mainType == mainType)
                userPokemon.mainType = pokemon.mainType;

            if(pokemon.secondType == secondType)
                userPokemon.secondType = pokemon.secondType;
        }
    }
    db.saveUserData(username,userData);
    db.saveUserPokemons(username,userPokemons);
    res.send();
}

export const getWildPokemonImg = async (req,res) =>
{
    let secretId = pokemonIdMapper[req.params.secretId-1];
    let resolution = parseInt(req.body.resolution) || parseInt(req.query.resolution);

    let defaultImage
    try 
    {
        defaultImage = await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secretId}.png`, { responseType: 'arraybuffer' });
    }
    catch
    {
        return res.status(404).send();
    }
    
    let image = await sharp(defaultImage.data)
        .resize(resolution,resolution)
        .toBuffer();


    res.set('Content-Type', 'image/png');
    res.status(200).send(image);
    
}
export const getWildPokemonName = async (req,res) =>
{
    let secretId = req.params.secretId;
    let pokemons = db.getPokemons();
    for(let pokemon of pokemons)
    {
        if(pokemon.id == pokemonIdMapper[secretId-1])
        {
            return res.status(200).json({name:pokemon.name});
        }
    }

    res.status(404).json({message:"Pokemon dont exist"});
}
export const fightPokemons = async (req,res) =>
{
    let username = req.body.username;
    let firstSecretId = req.body.firstSecretId;
    let secondSecretId = req.body.secondSecretId;
    let playerGuess = req.body.guess;

    let firstPokemon;
    let secondPokemon;

    let pokemons = db.getPokemons();
    for(let pokemon of pokemons)
    {
        if(pokemon.id == pokemonIdMapper[firstSecretId-1])
            firstPokemon = pokemon
        if(pokemon.id == pokemonIdMapper[secondSecretId-1])
            secondPokemon = pokemon
    }


    let user = db.getUserData(username);

    let winnerPokemon = firstPokemon;
    let loserPokemon = secondPokemon;
    let guess = false;
    
    //COUNT CP
    if(firstPokemon.attack+firstPokemon.defense > secondPokemon.attack + secondPokemon.defense && playerGuess == firstSecretId)
    {
        user.vsScore += 1
        winnerPokemon = firstPokemon;
        loserPokemon = secondPokemon;
        guess = true;
    }
    else if(firstPokemon.attack+firstPokemon.defense < secondPokemon.attack + secondPokemon.defense && playerGuess == secondSecretId)
    {
        winnerPokemon = secondPokemon;
        loserPokemon = firstPokemon;
        guess = true;
        user.vsScore += 1
    }

    db.saveUserData(username,user)
    res.status(200).json({winner:winnerPokemon,loser:loserPokemon,yourGuess:guess});
}