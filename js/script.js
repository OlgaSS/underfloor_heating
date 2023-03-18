new Swiper('.hero__slider', {
    spaceBetween: 10,
    loop: true,

    navigation: {
        nextEl: '.hero__slider-btn_next',
        prevEl: '.hero__slider-btn_prev',
    },

    autoplay: {
        delay: 3000,
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        420: {
            slidesPerView: 2,
            spaceBetween: 8,
        }
    }
})

// Калькулятор цены
const calcForm = document.getElementById('calc__form');
const totalSquare = document.querySelector('.calc__result-total-square');
const totalPrice = document.querySelector('.calc__result-total-price');
const calcResultRrapper = document.querySelector('.calc__result-wrapper');
const calcOrderBtn = document.querySelector('.calc__button');

const tariffs = {
    economy: 550,
    comfort: 1400,
    premium: 2700,
}

calcForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (calcForm.width.value > 0 && calcForm.length.value > 0) {
        const square = calcForm.width.value * calcForm.length.value;
        const price = square * tariffs[calcForm.tariff.value];

        calcResultRrapper.style.opacity = '1';
        totalSquare.textContent = `${square} кв м`;
        totalPrice.textContent = `${price} руб`;
        calcOrderBtn.style.display = 'inline-block';
    }
})

// Модальное окно
const scrollController = {
    scrollPosition: 0,
    disabledScroll() {
        scrollController.scrollPosition = window.scrollY;
        document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollController.scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding-right: ${window.innerWidth - document.body.offsetWidth}px;
        `;
        document.documentElement.style.scrollBehavior = 'unset';
    },
    enabledScroll() {
        document.body.style.cssText = `
        overflow: scroll;
        `;
        window.scroll({ top: scrollController.scrollPosition });
        document.documentElement.style.scrollBehavior = '';
    },
}

const modalController = (time = 270) => {
    const modal = document.querySelector('.modal');
    const modalButtons = document.querySelectorAll('.button-order');

    modal.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease;
`;

    const closeModal = event => {
        const target = event.target;

        if (target === modal || target.closest('.modal__button-close') || event.code === 'Escape') {
            modal.style.opacity = 0;

            setTimeout(() => {
                modal.style.visibility = 'hidden';
            }, time);
            scrollController.enabledScroll();

            window.removeEventListener('keydown', closeModal);
        }
    }

    const openModal = () => {
        modal.style.visibility = 'visible';
        modal.style.opacity = 1;
        window.addEventListener('keydown', closeModal);
        scrollController.disabledScroll()
    }

    modalButtons.forEach(button => {
        button.addEventListener('click', openModal);
    })


    modal.addEventListener('click', closeModal);
}
modalController();

// Маска для телефона
const phone = document.getElementById('phone');
const maskPhone = new Inputmask('+7(999)999-99-99');
maskPhone.mask(phone);

const validator = new JustValidate('.modal__form', {
    errorLabelCssClass: 'modal__input-error',
    errorLabelStyle: {
        color: '#FFC700',
    },
});

validator
    .addField('#name', [
        {
            rule: 'required',
            errorMessage: 'Укажите имя',
        },
    ])
    .addField('#phone', [
        {
            rule: 'required',
            errorMessage: 'Укажите телефон',
        },
        {
            validator: value => {
                const number = phone.inputmask.unmaskedvalue();
                return number.length === 10;
            },
            errorMessage: 'Телефон некорректный',
        }
    ])
    .onSuccess((event) => {
        const form = event.currentTarget

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                name: form.name.value,
                phone: form.phone.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                form.reset();
                alert('Спасибо, мы с вами свяжемся!')
            });
    })

