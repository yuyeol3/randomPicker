function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function assign(names, roles)
{
    var shuffled = [];
    var result = new Map();

    for (var i = 0; i < names.length; i++) {
        var idx = random(0, roles.length - 1);
        
        while (shuffled.includes(roles[idx]))
        {
            idx = random(0, roles.length - 1);
        }

        shuffled.push(roles[idx]);

    }

    for (var i = 0; i < names.length; i++)
    {
        result[names[i]] = shuffled[i];
    }

    return result;
}

console.log(assign(["김공군", "이필승", "박정예"], ["폰생", "쓰", "차"]))