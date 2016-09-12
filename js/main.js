
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

var list=document.querySelector('.catalog__list');
var couponsAll= []



/*добавляем купоны из JSON*/
function renderCoupon(coupon){
    var el=document.createElement('a')
    el.dataset.type=coupon.type
    el.dataset.special=coupon.special
    el.dataset.dateFrom=coupon.dateFrom
    el.dataset.dateTo=coupon.dateTo
    el.dataset.metro=coupon.metro
    el.dataset.price=coupon.priceNew

    el.className="catalog_cart catalog__item"
    el.innerHTML= `<div class="catalog_cart__image"><img src="img/epixx.jpg">
                    <div class="catalog_cart__timer timer">
                      <div class="timer__item"> <span> </span><span>day</span></div>
                      <div class="timer__item"><span> </span><span>hour</span></div>
                      <div class="timer__item"><span> </span><span>min</span></div>
                      <div class="timer__item"><span> </span><span>sec</span></div>
                    </div>
                  </div>
                  <div class="catalog_cart__content">
                    <div class="catalog_cart__discount">27%</div>
                    <p class="catalog_cart__title">27% discount on course of internet marketing</p>
                    <div class="catalog_cart__footer">
                      <p class="catalog_cart__price"><span class="price catalog_cart__price_old">33</span><span class="price catalog_cart__price_new">24</span></p>
                      <div class="catalog_cart__btn">
                        <p class="btn">to cart</p>
                      </div>
                    </div>
                  </div>`
    el.querySelector('.catalog_cart__image img').src =coupon.backgroundUrl
    el.querySelector('.catalog_cart__discount').innerHTML=coupon.discount+'%'
    el.querySelector('.catalog_cart__title').innerHTML=coupon.title
    el.querySelector('.catalog_cart__price_old').innerHTML=coupon.priceOld
    el.querySelector('.catalog_cart__price_new').innerHTML=coupon.priceNew

    if(coupon.special){
        el.classList.add('catalog_cart--special')
        // el.querySelector('.catalog_cart__timer').style.display="block"
        //добавить счетчик в таймер
       var timer = el.querySelectorAll('.timer__item')
       var dateTo = coupon.dateTo
       dateTo = dateTo.split(' ').join('.000');
       dateTo = new Date(dateTo);
       var now = new Date();
       var timeLeft = dateTo - now;
        if (timeLeft<=0){
            el.classList.remove('catalog_cart--special')
            el.classList.add('catalog_cart--disabled')
        //clearInterval?
         } else {
        //count time
            var days = Math.floor(timeLeft/(1000*60*60*24))
            var remains = timeLeft - days*(1000*60*60*24);
            var hours = Math.floor(remains/(1000*3600));
            remains = remains - hours*(1000*3600);
            var minutes = Math.floor(remains/(1000*60));
            remains = remains - minutes*(1000*60);
            var seconds = Math.floor(remains/(1000));
            var timerValuesInitial = [days,hours,minutes,seconds]
            for(var i=0;i<timer.length;i++){
                timer[i].firstChild.innerHTML=timerValuesInitial[i]

            }
        }


    }
    return el
}



//вставить функцию запроса в json из нашей системы
function render(coupons){

    for(var i=0;i<coupons.length;i++){
        var coupon=renderCoupon(coupons[i]);
        list.appendChild(coupon)
}
    }

function getJSON(url, onSuccess) {
        var request = new XMLHttpRequest();
        request.open('get', url, true)
        request.onreadystatechange =  function(){
                if(request.readyState===4){
                var response=JSON.parse(request.responseText);
                onSuccess(response)
                };
        };
        request.send();
        return request;
}


getJSON('./data.json', function(coupons) {
        render(coupons)
        couponsAll = document.querySelectorAll('.catalog__item');
        addListenersToButtons();
})




/* добавляем купоны в корзину */

 function addListenersToButtons() {

    for (var i=0; i<couponsAll.length; i++){
        couponsAll[i].addEventListener('click',(function(i){
            return function(e){
                e.preventDefault();
                if (!couponsAll[i].classList.contains("catalog_cart--disabled")){
                    var price = Number(couponsAll[i].dataset.price);
                    var element=couponsAll[i].querySelector(".catalog_cart__title")
                    var title = element.innerText;
                    addToCart(title,price);
                }
            }
        })(i))
    }
 }


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


}

function removeFromCart(e, context) {
    var parent = context.parentNode;
    var position = Number(parent.dataset.position);
    cart[position] = null;
    parent.remove();
    updateTotal();
}


/*изменение вида списка купонов 2-3*/
var catalogListViewItem = document.querySelectorAll('.catalog_view__item');
var catalogListView = document.querySelector('.catalog__list');

catalogListViewItem[0].addEventListener('click', function(e){
     e.preventDefault();
    catalogListView.classList.remove('catalog__list--three');
    catalogListViewItem[0].classList.add('catalog_view__item--active');
    catalogListView.classList.add('catalog__list--two');
    catalogListViewItem[1].classList.remove('catalog_view__item--active');
})
catalogListViewItem[1].addEventListener('click', function(e){
    e.preventDefault();
    catalogListView.classList.add('catalog__list--three');
    catalogListViewItem[0].classList.remove('catalog_view__item--active');
    catalogListView.classList.remove('catalog__list--two');
    catalogListViewItem[1].classList.add('catalog_view__item--active');
})


/*sorting by price*/

var sortBtn = document.querySelectorAll('.catalog_sort__item')
sortBtn[0].addEventListener("click",function(e){
    e.preventDefault()
    var counterOut=1
            while(counterOut!=0){
                for(var j=0;j<couponsAll.length-1;j++){
                    var counter=0
                    if(couponsAll[j].dataset.price>couponsAll[j+1].dataset.price){
                        list.insertBefore(couponsAll[j+1],couponsAll[j])
                        var storage=couponsAll[j]
                        couponsAll[j]=couponsAll[j+1]
                        couponsAll[j+1]=storage
                        counter++
                    }
                    counterOut=counter

                }
                couponsAll = document.querySelectorAll('.catalog__item');
            }

    // for(var i=0;i<couponsAll.length;i++){
    //     if (couponsAll[i].classList.contains('catalog_cart--disabled')){
    //         list.appendChild(couponsAll[i])
    //     }else{

    //     }

    // }
})




/* open modal window*/
var buyBtn=document.querySelector('.catalog_basket__summ .btn')
var modalUnderlay=document.querySelector('.modal_underlay')
var modalWindow=document.querySelector('.modal_order')
var closeModalBtn=document.querySelector('.modal__close')
buyBtn.addEventListener('click', function (e) {
    e.preventDefault()
    modalWindow.style.display="block"
    modalUnderlay.style.display="block"

})

modalUnderlay.addEventListener('click',function(){
    modalWindow.style.display="none"
    modalUnderlay.style.display="none"
})


closeModalBtn.addEventListener('click',function(e){
    e.preventDefault()
    modalWindow.style.display="none"
    modalUnderlay.style.display="none"
})

/*open-close filter*/

var filters=document.querySelectorAll('.filter__title')
var filtersContent=document.querySelectorAll('.catalog_filters__item')
for (var i = 0; i < filters.length; i++) {
    filters[i].addEventListener('click',(function(i){
        return function(){
          filtersContent[i].classList.toggle('filter--open')
        }
    })(i))
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
// document.forms.order.elements.name.addEventListener("input",function(e) {
//    if(validate(this, /[a-zа-я]+\s?[a-zа-я]+/i)===null){
//     this.style.borderColor="red";
//     this.style.color="red";
//    }else{
//     this.style.borderColor="black";
//     this.style.color="black";
//     }
// })//и так по каждой форме



// function validate(input,regular){
// return input.value.match(regular)
// }

// function validateAll(){
//     validate("name",/[a-zа-я]+\s?[a-zа-я]+/i);
//     validate("phone",/^\+?[0-9\(\)\-]+$/);
//     validate("mail",/.+@.+\..+/);
//     validateCheckBox();


// }


// function validateCheckBox(){
//     var flag=false;
//     var checkBoxes=document.forms.order.elements.delivery;
//     for (var i=0; i<chechBoxes.length;i++){
//          if (checkBoxes[i].checked){
//             flag=true;
//         }
//     }
// return flag;
//}


// document.forms.order.elements.sendBtn.addEventListener("click",function(e){
//     e.preventDefault();
// validateCheckBox();
// })

