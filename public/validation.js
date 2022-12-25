
var validateForm = function () {
  let name = document.forms["register-form"]["name"].value;
  let lastname = document.forms["register-form"]["lastname"].value;
  let email = document.forms["register-form"]["email"].value;
  let phone = document.forms["register-form"]["phone"].value;
  let password = document.forms["register-form"]["password"].value;
  let password2 = document.forms["register-form"]["password2"].value;

  let namecheck = document.querySelector(".name-check");
  let lastnamecheck = document.querySelector(".lastname-check");
  let emailcheck = document.querySelector(".email-check");
  let phonecheck = document.querySelector(".phone-check");
  let passwordcheck = document.querySelector(".password-check");
  let password2check = document.querySelector(".password2-check");



  if (name == "") {
    namecheck.classList += "d-block"
    return false;
  }
  if (lastname == "") {
    lastnamecheck.classList += "d-block"
    return false;
  }

  if (email == "") {
    emailcheck.classList += "d-block"
    return false;
  }

  if (phone == "" || phone.length != 11) {
    phonecheck.classList += "d-block"
    return false;
  }

  if (password == "") {
    passwordcheck.classList += "d-block"
    return false;
  }

  if (password2 != password) {
    password2check.classList += "d-block"
    return false;
  }
}

var validateUpAcc = function () {
  let phone = document.forms["accform"]["phone"].value;
  let phonecheck = document.querySelector(".phone-check");

  if (phone == "" || phone.length != 11) {

    phonecheck.classList += "d-block"
    return false;
  }
}

var validateAdress = function () {
  let phone = document.forms["adress-form"]["adress_tel"].value;
  let adress_h = document.forms["adress-form"]["adress_h"].value;
  let adress_district = document.forms["adress-form"]["adress_district"].value;
  let adress_city = document.forms["adress-form"]["adress_city"].value;

  let adress = document.querySelector(".add-adress").value;
  let adress_title = document.querySelectorAll(".adress-title");
  let phonecheck = document.querySelector(".phone-check");
  let adress_h_check = document.querySelector(".adress-h-check");
  let adress_check = document.querySelector(".adress-check");
  let adress_city_check = document.querySelector(".adress-city-check");
  let adress_district_check = document.querySelector(".adress-district-check");


  if (adress_h.length == 0) {
    adress_h_check.innerHTML = `Bu alan dolu olmak zorundadır!`;
    adress_h_check.classList += "d-block";
    return false;
  }

  for (let i = 0; i < adress_title.length; i++) {
    if (adress_title[i].innerHTML == `<b>${adress_h}</b>`) {
      adress_h_check.innerHTML = `Farklı bir adres başlığı giriniz !`;
      adress_h_check.classList += "d-block";
      i = adress_title;
      return false;
    }
  }

  if (phone.length != 11) {
    phonecheck.classList += "d-block";
    return false;
  }

  if (adress_city.length == 0) {
    adress_city_check.innerHTML = `Bu alan dolu olmak zorundadır!`;
    adress_city_check.classList += "d-block";
    return false;
  }

  if (adress_district.length == 0) {
    adress_district_check.innerHTML = `Bu alan dolu olmak zorundadır!`;
    adress_district_check.classList += "d-block";
    return false;
  }
  if (adress.length < 5) {

    adress_check.innerHTML = `Minimum 5 haneli olmalıdır !`;
    adress_check.classList += "d-block";
    return false;
  }


}

var validateWallet = function () {
  let money = document.forms["wallet-form"]["add_wallet"].value;
  let moneycheck = document.querySelector(".money-check");
  console.log(money)
  if (money <= 0 || money == "") {

    moneycheck.classList += "d-block"
    return false;
  }
}