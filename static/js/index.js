
// 지정한 html selector에 html content를 추가하는 함수
function add_element(selector, html_content)
{
    var prev_content = $(selector).html();
    $(selector).html(prev_content + html_content);
}


// Html 요소 생성을 도와주는 클래스
class HtmlElementGenerator {
    // htmlBase에는 기초가 될 html 코드를 작성합니다.
    constructor (htmlBase) {
        this.htmlBase = htmlBase;
        this.baseArgs = [];
    } 

    // 입력한 htmlBase에 baseArgs를 포매팅해 리턴하는 메소드
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

class ElementList {
    constructor (selector, generator) {
        this.selector = selector;
        this.elements = [];
        this.generator = generator;
    }

    push (to_add) {
        this.elements.push(to_add);
    }

    remove (index) {
        this.elements.splice(index, 1);
    }

    removeAll () {
        this.elements = [];
    }

    render () {
        $(this.selector).html("");

        this.elements.forEach((e, i) => {
            var htmlCode = this.generator.getHtmlCode([i, e, i]);
            add_element(this.selector, htmlCode);
        });
    }

    getElements () {
        return this.elements;
    }

}

// [min, max]의 범위에서 무작위한 수를 리턴하는 함수
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// roles를 무작위로 names에 할당하는 함수
function assign_roles(names, roles)
{
    
    var used_idx = [];
    var shuffled = [];
    var result = new Map();

    for (var i = 0; i < names.length; i++) {
        var idx = random(0, roles.length - 1);
        
        while (used_idx.includes(idx))
        {
            idx = random(0, roles.length - 1);
        }

        shuffled.push(roles[idx]);
        used_idx.push(idx);
    }

    for (var i = 0; i < names.length; i++)
    {
        result.set(names[i], shuffled[i]);
    }

    return result;
}



const nameElementGenerator = new HtmlElementGenerator(
    '<div class="element" id="{0}">' + 
        '<p class="element_text">㏅ {1}</p><button class="element_button" onclick="(() => {names.remove({2}); names.render();})()">×</button>' + 
    '</div>'
);
const names = new ElementList("#home #main #name_div #elements_list", nameElementGenerator);
function add_name() {
    var to_add = $("#home #main #name_div input").val();

    if (to_add === '') {
        return;
    }
    names.push(to_add);
    names.render();
    $("#home #main #name_div input").val("");

}

const roleElementGenerator = new HtmlElementGenerator(
    '<div class="element" id="{0}">' + 
        '<p class="element_text">⒡ {1}</p><button class="element_button" onclick="(() => {roles.remove({2}); roles.render();})()">×</button>' + 
    '</div>'
);

const roles = new ElementList("#home #main #role_div #elements_list", roleElementGenerator);
function add_role() {
    var to_add = $("#home #main #role_div input").val();

    if (to_add === '') {
        return;
    }

    roles.push(to_add);
    roles.render();
    $("#home #main #role_div input").val("");
}

function resetAll() {
    names.removeAll();
    roles.removeAll();
    $("#home #main #name_div input").val("");
    $("#home #main #role_div input").val("");
    names.render();
    roles.render();
}

var isMainPage = true;


function changePage() {
    var pages = $(".page_div")

    if (isMainPage) {
        // 통과조건
        if (names.elements.length === 0 || roles.elements.length === 0)
        {
            alert("입력하지 않은 항목이 있습니다.");
            return;
        }

        if (names.elements.length != roles.elements.length) {
            alert("이름과 역할의 개수가 일치하지 않습니다.");
            return;
        }


        // 메인페이지 > 결과페이지
        $("body #result").insertAfter("body #home");
        showResult();
        $("#home").attr("style", "opacity: 0;");
        $("#result").attr("style", "opacity: 100;");

    } else {
        // 결과페이지 > 메인페이지
        $("#result_table").html("");
        $("body #home").insertAfter("body #result");
        $("#result").attr("style", "opacity: 0;");
        $("#home").attr("style", "opacity: 100");
    }

    isMainPage = !isMainPage;
}


function showResult() {
    var res = assign_roles(names.getElements(), roles.getElements());
    const tableGenerator = new HtmlElementGenerator(
        '<tr>' +
            '<td class="res_name">㏅ {0}</td>' +
            '<td class="res_blank">></td>' +
            '<td class="res_role">⒡ {1}</td>' +
        '</tr>'
    );


    res.forEach((val, key) => {
        add_element("#result_table", tableGenerator.getHtmlCode([key, val]));
    });
}




// url에 데이터가 미리 입력된 경우 처리
if ($("#names").val() != "" && $("#roles").val() != "") {
    
    const name_arg = String($("#names").val()) 
    const role_arg = String($("#roles").val()) 

    name_arg.split(",").forEach((e) => {
        names.push(e);
    });

    role_arg.split(",").forEach((e) => {
        roles.push(e);
    })




    names.render();
    roles.render();
}