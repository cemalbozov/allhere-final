const attr_number = document.querySelector("#attr-number");
const attr_div = document.querySelector(".form-attributes");

attr_number.addEventListener("change",updateForm)



function updateForm(e){
    console.log(e.target.value)
    if(e.target.value <1){
        e.target.value = 1;
    }
    attr_div.innerHTML = "";
    for (let index = 1; index <= e.target.value; index++) {
        attr_div.innerHTML += `<div class="col-12 col-lg-6 px-0">
        <div class="form-text">Özellik ${index} Adı </div>
        <input type="text" class="form-control " name="attributes" required">
    </div>
    <div class="col-12 col-lg-6 px-0">
        <div class="form-text">Özellik ${index} Değeri </div>
        <input type="text" class="form-control " name="attributes" required">
    </div>`
        
    }
}