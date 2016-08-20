
var cart = []

var svgClose = `<div onclick="removeFromCart(event, this)" class="catalog_basket__close"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 44.238 44.238" style="enable-background:new 0 0 44.238 44.238;" xml:space="preserve">
<g>
    <g>
        <g>
            <path d="M15.533,29.455c-0.192,0-0.384-0.073-0.53-0.22c-0.293-0.293-0.293-0.769,0-1.062l13.171-13.171     c0.293-0.293,0.768-0.293,1.061,0s0.293,0.768,0,1.061L16.063,29.235C15.917,29.382,15.725,29.455,15.533,29.455z" fill="#546e7a"/>
        </g>
        <g>
            <path d="M28.704,29.455c-0.192,0-0.384-0.073-0.53-0.22L15.002,16.064c-0.293-0.293-0.293-0.768,0-1.061s0.768-0.293,1.061,0     l13.171,13.171c0.293,0.293,0.293,0.769,0,1.062C29.088,29.382,28.896,29.455,28.704,29.455z" fill="#546e7a"/>
        </g>
        <path d="M22.119,44.237C9.922,44.237,0,34.315,0,22.12C0,9.924,9.922,0.001,22.119,0.001S44.238,9.923,44.238,22.12    S34.314,44.237,22.119,44.237z M22.119,1.501C10.75,1.501,1.5,10.751,1.5,22.12s9.25,20.619,20.619,20.619    s20.619-9.25,20.619-20.619S33.488,1.501,22.119,1.501z" fill="#546e7a"/>
    </g>
</g>
</svg></div>`






function renderCoupon(coupon){
    var el=document.createElement('a')
    el.dataset.type=coupon.type
    el.dataset.special=coupon.special
    el.dataset.dateFrom=coupon.dateFrom//finish dataset
    el.className="catalog_cart"//see the html and add
    //дописать картинки и названия и тд
    if(coupon.special){
        el.classList.add('catalog')//correct class name
    }
    return el
}

//вставить функцию запроса в json из нашей системы
function render(coupons){
    var list=document.querySelector('.catalog__list');
for(var i=0;i<coupons.length;i++){
    var coupon=renderCoupon(coupons[i]);
    list.appendChild(coupon)
}
    }









/* подписаться на клики: addEventListener */
var toCart = document.querySelectorAll('.catalog_cart__btn');
for (var i=0; i<toCart.length; i++){
    toCart[i].addEventListener('click',function(e){
        e.preventDefault();
        var element = e.target.parentNode.parentNode.parentNode.parentNode;
        var price = Number(element.dataset.price);
        element = e.target.parentNode.parentNode.previousElementSibling;
        var title = element.innerText;
        console.log(price,title);
        addToCart(title,price);
    })
}
//console.log(el);
    /* создать объект */
    /* создать элемент. document.createElement('div'), .innerHTML */
    /* appendChild к списку */
    /* обновить тотал */
function addToCart(title, price) {
    var el = document.createElement('div');
    el.classList.add('catalog_basket__line');
    el.innerHTML = "<div class='catalog_basket__product'>" + title +
    "</div><div class='catalog_basket__price price'>" + price +
    "</div>" + svgClose;
    el.dataset.position = cart.length;
    document.querySelector('.catalog_basket__list').appendChild(el);
cart.push({ title:title, price: price})
updateTotal()
}

function updateTotal() {
    var sum = 0;
for(var i=0;i<cart.length; i++){
    if(cart[i]!== null) {
        sum+=cart[i].price;
    }
}
document.querySelector(".catalog_basket__summ_text").innerHTML=sum
console.log(sum)
    /* подсчитать тотал на основе cart */
    /* найти элемент тотала, обновить число */
}

function removeFromCart(e, context) {
    var parent = context.parentNode;
    console.log(parent);
    var position = Number(parent.dataset.position);
    cart[position] = null;
    parent.remove();
    updateTotal();
}




// function validateName(){
//    return document.forms.order.elements.name.value.match(/[a-zа-я]+\s[a-zа-я]+/i)
// }


// function validatePhone(){
//    return document.forms.order.elements.phone.value.match(/^\+?[0-9\(\)\-]+/)
// }


// function validateEmail(){
//   return  document.forms.order.elements.email.value.match(/.+@.+\..+/)
// }
document.forms.order.elements.name.addEventListener("input",function(e) {
   if(validate(this, /[a-zа-я]+\s?[a-zа-я]+/i)===null){
    this.style.borderColor="red";
    this.style.color="red";
   }else{
    this.style.borderColor="black";
    this.style.color="black";
    }
})//и так по каждой форме



function validate(input,regular){
return input.value.match(regular)
}

// function validateAll(){
//     validate("name",/[a-zа-я]+\s?[a-zа-я]+/i);
//     validate("phone",/^\+?[0-9\(\)\-]+$/);
//     validate("mail",/.+@.+\..+/);
//     validateCheckBox();


// }


function validateCheckBox(){
    var flag=false;
    var checkBoxes=document.forms.order.elements.delivery;
    for (var i=0; i<chechBoxes.length;i++){
         if (checkBoxes[i].checked){
            flag=true;
        }
    }
return flag;
}



document.forms.order.elements.sendBtn.addEventListener("click",function(e){
    e.preventDefault();
validateCheckBox();
})