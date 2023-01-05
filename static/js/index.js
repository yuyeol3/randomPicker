class HtmlElementGenerator{
    // Html 요소 생성을 도와주는 클래스
    constructor (htmlBase) {
        // htmlBase에는 기초가 될 html 코드를 작성합니다.
        this.htmlBase = htmlBase;
        this.baseArgs = [];
    } 

    getHtmlCode(baseArgs) {
        if (baseArgs === []) {
            return;
        }
        
        var to_return = this.htmlBase
        baseArgs.forEach((element, idx) => {
            to_return = to_return.replace("{" + idx + "}", String(element));
        });

        return to_return;
    }
}
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

function add_element(selector, html_content)
{
    const prev_content = $(selector).html();
    $(selector).html(prev_content + html_content);
}

const nameElementGenerator = new HtmlElementGenerator("<div>{0}<button>+</button></div>");

