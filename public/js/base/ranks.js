const Ranks = {
    'დამწყები' : [0, 24],
    'გარდამავალი' : [25, 30],
    'საშუალო' : [31,41],
    'პროფესიონალი' : [42, 54],
    'ოსტატი' : [55, 79],
    'მეგამრბოლელი' : [80, 500]
};

function getRank(points){
    for(var i = 0; i < Object.keys(Ranks).length; i++){
        if(Ranks[Object.keys(Ranks)[i]][0] <= points && points <= Ranks[Object.keys(Ranks)[i]][1]){
            return Object.keys(Ranks)[i];
        }
    }
}