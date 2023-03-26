// document.body.style.border = "5px solid blue";

let search_elems = Array.from(document.querySelectorAll("div")).filter((x)=> x.className === "text-center" && x.textContent.trim().toLowerCase().startsWith("rechercher une"));
let el = search_elems[0];

let select = el.getElementsByTagName("select")[0];

let option_els = Array.from(select.childNodes).filter((x) => x.nodeName.toLowerCase()==="option");
let options_dat = [];
for (let i = 0; i < option_els.length; i++) {
    const option_elt = option_els[i];
    let data_txt = option_elt.getAttribute("data-content").trim();
    let clean = data_txt.replace(/<[^>]*>/, "");
    options_dat.push([option_elt.value, clean]);
}

el.innerHTML = "";

//search change filter

let ready = false;

function is_active(cls_lst){
    return cls_lst.contains("show") && cls_lst.contains("active")
}

function handle_search_change(){
    if (!ready){
        return
    }

    let target_panel = document.getElementById("myTabContent");

    let target_tab_list = Array.from(target_panel.childNodes).filter((e)=> e.nodeName.toLowerCase()==="div" && is_active(e.classList));

    let target_tab

    if (target_tab_list.length>=1){
        target_tab = target_tab_list[0];
    } else{
        console.log("missing target tab list");
        return
    };

    let target_cards = Array.from(target_tab.firstElementChild.childNodes).filter((e)=>e.nodeName.toLowerCase()==="div");

    let search_input = document.getElementById("search_input")
    let searchval = search_input.value

    let hardness_checks = Array.from(document.getElementsByClassName("level_label_check")).filter((e)=> !e.checked).map((e)=> e.getAttribute("data-hardness") )

    for (let i = 0; i < target_cards.length; i++) {
        const card = target_cards[i];
        let title = card.querySelector("h3").textContent
        let problem_hardness = card.querySelector("h5").textContent.trim().toLowerCase();
        
        if (title.toLowerCase().includes(searchval.trim().toLowerCase()) && hardness_checks.includes(problem_hardness)){
            card.style = "";
        } else{
            card.style.display = "none";
        }
        
    };
}

function time_search_change(){
    console.log("e");
    handle_search_change()
}

// Search_For_Text

let text_search = document.createElement("div");
text_search.className="input-group mb-3";
let inp = document.createElement("input");
inp.type = "text";
inp.className = "form-control";
inp.id = "search_input";
inp.placeholder = "ex: Enigme 1"
text_search.appendChild(inp)
//btn
let group = document.createElement("div");
group.className="input-group-append";
let ref_icon = document.createElement("i");
ref_icon.className = "far fa-sync";
let reload_button = document.createElement("button");
reload_button.className = "btn btn-primary";
reload_button.appendChild(ref_icon);
group.appendChild(reload_button);
text_search.appendChild(group);

reload_button.addEventListener("click", handle_search_change)

inp.addEventListener("input", handle_search_change)
inp.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      handle_search_change()
    }
  }); 

el.appendChild(text_search);

//hardness filters
let hardness_container = document.createElement("div");
hardness_container.className = "btn-group-toggle";
let hardness_lvls =    [["facile", "success"], 
                        ["moyen", "warning"], 
                        ["difficile", "danger"]]
for (let i = 0; i < hardness_lvls.length; i++) {
    const dat = hardness_lvls[i];
    const lvl = dat[0];
    const color = dat[1];

    let label = document.createElement("label");
    label.className = "btn btn-"+color+" mx-2";
    label.setAttribute("data-toggle", "buttons")

    let label_check = document.createElement("input");
    label_check.setAttribute("data-hardness", lvl)
    label_check.className = "level_label_check"
    label_check.type = "checkbox";
    label_check.setAttribute("autocomplete","off");

    // create a new instance of `MutationObserver` named `observer`,
    // passing it a callback function
    let prevState = label.classList.contains("active");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(function(mutation) {
            if (!mutation.attributeName === 'class'){
                return
            };

            const currentState = mutation.target.classList.contains("active");
            if (prevState !== currentState) {
                prevState = currentState;
                console.log(`'active' class ${currentState ? 'added' : 'removed'}`);
                handle_search_change()
            }
        })
    
    });

    // call `observe()` on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(label, {attributes:true});


    label_check.addEventListener("change", ()=>{time_search_change(); console.log("e");})

    label.append(lvl)

    label.appendChild(label_check);
    
    hardness_container.appendChild(label)
    
}

el.appendChild(hardness_container);

//

/* <button class="btn btn-primary"><span class="glyphicon glyphicon-refresh"></span> Refresh</button> */

//set the search status to ready

ready = true;
handle_search_change()

//Normal Thingy
/* let textual_search = document.createElement("div");
textual_search.className = "textual_search"

textual_search.innerHTML = '<select name="Enigme[]" class="selectpicker" data-live-search="true" multiple="" tabindex="-98"></select>'

let select_el = textual_search.firstChild

for (let i = 0; i < options_dat.length; i++) {
    const dat = options_dat[i];
    let insert_option_el = document.createElement("option");
    insert_option_el.value = dat[0];
    insert_option_el.setAttribute("data-content", dat[1]);
    
    select_el.appendChild(insert_option_el)
}

textual_search.appendChild(select_el)

el.appendChild(textual_search)


 */