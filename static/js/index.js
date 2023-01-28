
/**
 * 지정한 html selector에 html content를 추가하는 함수
 * @param {string} selector html content를 추가할 selector 
 * @param {string} html_content 추가할 html content
 */
// 지정한 html selector에 html content를 추가하는 함수
function add_element(selector, html_content)
{
    let prev_content = $(selector).html();
    $(selector).html(prev_content + html_content);
}

/**
 * Html 요소 생성을 도와주는 클래스
 */
class HtmlElementGenerator {
    /**
     * HtmlElementGenerator 생성자
     * @param {string} htmlBase 기초가 될 Html 템플릿 
     */
    constructor (htmlBase) {
        this.htmlBase = htmlBase;
        this.baseArgs = [];
    } 

    /**
     * 입력한 htmlBase에 baseArgs를 포메팅해 리턴하는 메소드
     * @param {Array} baseArgs htmlBase에 포메팅할 요소들을 Array형식으로 넣음
     * @returns baseArgs가 비었으면 아무것도 리턴하지 않고, 그렇지 않으면 포메팅한 문자열을 리턴
     */
    getHtmlCode(baseArgs) {
        if (baseArgs === []) {
            return;
        }
        
        let to_return = this.htmlBase
        baseArgs.forEach((element, idx) => {
            to_return = to_return.replace("{" + idx + "}", String(element));
        });

        return to_return;
    }
}

/**
 * Array처럼 값을 저장하면서 render 메소드를 통해 정해진 형태로 html 요소를 추가할 수 있는 클래스
 */
class ElementList {
    /**
     * ElementList 생성자
     * @param {string} selector 만들어진 html 요소를 추가할 selector
     * @param {HtmlElementGenerator} generator 리스트의 요소를 html로 바꾸기 위한 html요소 생성기
     */
    constructor (selector, generator) {
        this.selector = selector;
        this.elements = [];
        this.generator = generator;
    }

    /**
     * ElementList에 요소를 추가하는 메소드
     * @param {string} to_add 리스트에 추가할 요소
     */
    push (to_add) {
        this.elements.push(to_add);
    }

    /**
     * ElementList에서 특정 요소를 삭제하는 메소드
     * @param {number} index 
     */
    remove (index) {
        this.elements.splice(index, 1);
    }

    /**
     * ElementList에서 특정 요소를 삭제하는 메소드
     */
    removeAll () {
        this.elements = [];
    }

    /**
     * ElementList의 모든 요소를 html element로 바꾸어 지정된 selector에 추가하는 메소드
     */
    render () {
        $(this.selector).html("");

        this.elements.forEach((e, i) => {
            let htmlCode = this.generator.getHtmlCode([i, e, i]);
            add_element(this.selector, htmlCode);
        });
    }

    /**
     * ElementList의 모든 요소를 Array 형식으로 반환하는 메소드
     * @returns ElementList의 모든 요소
     */
    getElements () {
        return this.elements;
    }

}

/**
 * [min, max]의 범위에서 무작위한 수를 리턴하는 함수
 * @param {number} min 범위의 최소값 
 * @param {number} max 범위의 최대값
 * @returns 범위 사이의 무작위한 수
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * roles를 무작위로 names에 할당하는 함수
 * @param {Array} names 원소가 문자열로 된 이름인 배열
 * @param {Array} roles 원소가 문자열로 된 역할인 배열
 * @returns 무작위로 할당한 결과
 */
function assign_roles(names, roles)
{
    
    let used_idx = [];
    let shuffled = [];
    let result = new Map();

    for (let i = 0; i < names.length; i++) {
        let idx = random(0, roles.length - 1);
        
        while (used_idx.includes(idx))
        {
            idx = random(0, roles.length - 1);
        }

        shuffled.push(roles[idx]);
        used_idx.push(idx);
    }

    for (let i = 0; i < names.length; i++)
    {
        result.set(names[i], shuffled[i]);
    }



    return result;
}


/**
 * 이름 htmlElement생성기
 */
const nameElementGenerator = new HtmlElementGenerator(
    '<div class="element" id="{0}">' + 
        '<p class="element_text">㏅ {1}</p><button class="element_button" onclick="(() => {names.remove({2}); names.render();})()">×</button>' + 
    '</div>'
);

/**
 * 이름 ElementList
 */
const names = new ElementList("#home #main #name_div #elements_list", nameElementGenerator);


/**
 * 메인 페이지에 이름을 추가해주는 함수.
 * input에 문자열이 없으면 동작하지 않고,
 * 문자열이 있으면 names에 요소를 추가 후 div에 이름들을 render
 */
function add_name() {
    let to_add = String( $("#home #main #name_div input").val() );

    if (to_add === '') {
        return;
    }
    names.push(to_add);
    names.render();
    $("#home #main #name_div input").val("");

}

/**
 * 역할 htmlElement생성기
 */
const roleElementGenerator = new HtmlElementGenerator(
    '<div class="element" id="{0}">' + 
        '<p class="element_text">⒡ {1}</p><button class="element_button" onclick="(() => {roles.remove({2}); roles.render();})()">×</button>' + 
    '</div>'
);

/**
 * 역할 ElementList
 */
const roles = new ElementList("#home #main #role_div #elements_list", roleElementGenerator);

roles.autoFillRoles = (nameNum) => {
    if (nameNum < 1) {
        alert('이름을 한 개 이상 입력하세요.');
        return;
    }


    if (nameNum === 1) {
        roles.elements.push("폰생쓰차");
    } else if (nameNum === 2) {
        roles.elements.push("폰생쓰");
        roles.elements.push("차");
    } else {    
        roles.elements.push("폰생");
        roles.elements.push("쓰");

        let chachulNum = nameNum / 3;
        chachulNum = Math.ceil(chachulNum);
        
        for (let i = 0; i < chachulNum; i++) {
            roles.elements.push("차출");
        }

        let left = nameNum - (chachulNum + 2);

        for (let i = 0; i < left; i++) {
            roles.elements.push("통과");
        }
    }

    roles.render();
} 



roles.render = () => {
    $(roles.selector).html("");

    roles.elements.forEach((e, i) => {
        let htmlCode = roles.generator.getHtmlCode([i, e, i]);
        add_element(roles.selector, htmlCode);
    });

    if (roles.elements.length == 0) {
    add_element("#home #main #role_div #elements_list", 
                '<button class="action_button" id="auto-fill" onclick="roles.autoFillRoles(names.elements.length)">' +
                '자동완성</button>');
    }

}


/**
 * 메인 페이지에 역할을 추가해주는 함수.
 * input에 문자열이 없으면 동작하지 않고,
 * 문자열이 있으면 roles에 요소를 추가 후 div에 역할들을 render.
 */
function add_role() {
    let to_add = String( $("#home #main #role_div input").val() );

    if (to_add === '') {
        return;
    }

    roles.push(to_add);
    roles.render();
    $("#home #main #role_div input").val("");
}

/**
 * 메인 페이지를 초기화하는 함수
 */
function resetAll() {
    names.removeAll();
    roles.removeAll();
    $("#home #main #name_div input").val("");
    $("#home #main #role_div input").val("");
    
    names.render();
    roles.render();
}

/**
 * 현재 페이지의 위치를 나타내는 변수.
 * 메인 페이지이면 true, 결과 페이지이면 false
 */
let isMainPage = true;

/**
 * 페이지를 변경하는 함수
 */
function changePage() {
    let pages = $(".page_div")

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

/**
 * 결과 페이지에 역할 배정 결과를 출력하는 함수
 */
function showResult() {
    // 역할 할당하기
    let res = assign_roles(names.getElements(), roles.getElements());
    let res_arr = [];
    res.forEach((val, key) => { 
        res_arr.push([val, key])
    });

    res_arr.sort()

    const tableGenerator = new HtmlElementGenerator(
        '<tr>' +
            '<td class="res_name">㏅ {0}</td>' +
            '<td class="res_blank">></td>' +
            '<td class="res_role">⒡ {1}</td>' +
        '</tr>'
    );


    res_arr.forEach((val, idx) => {
        add_element("#result_table", tableGenerator.getHtmlCode([val[1], val[0]]));
    });
}


// url에 데이터가 미리 입력된 경우 처리
if ($("#names").val() != "") {
    const name_arg = String($("#names").val()); 
    names.elements = name_arg.split(",");
    names.render();
}

if ($("#roles").val() != "") {
    const role_arg = String($("#roles").val()); 
    roles.elements = role_arg.split(",");
    roles.render();    

}

