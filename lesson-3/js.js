'use strict';

class CustomValidation {
  constructor(className, dataAttr, rulesArray) {
    this.form = document.querySelector(className);
    this.dataAttr = dataAttr;
    // Фильтруем нужные нам элементы
    this.elements = [...this.form.elements].filter((item) => {
      return (item.dataset[this.dataAttr] !== undefined)
    });
    // Массив объектов-правил
    this.rules = rulesArray;
    // Флаг наличия ошибок
    this.stopSubmit = false;
  }

  feedback() {
    this.elements.forEach(item => {
      let feedBackEl = document.createElement('ul');
      feedBackEl.classList.add('feedback__wrapper');

      this.rules[item.dataset[this.dataAttr]].forEach((rule) => {
        feedBackEl.insertAdjacentHTML('beforeend', `<li class="feedback">${rule.invalidityMessage}</li>`)
      });
      item.insertAdjacentElement('afterend', feedBackEl)
    });
  }

  checkValidity(item) {
    const feedbackList = item.nextSibling;

    //Массив ошибок для каждого инпута
    let errors = [];
    //Проходим по массиву правил подходящему под data-attr
    this.rules[item.dataset[this.dataAttr]].forEach((rule, index) => {
      //вызываем функцию проверки которая возвращает true или false
      if (rule.isInvalid(item)) {
        this.stopSubmit = true;
        errors.push(rule.invalidityMessage);
        // Добавляем класс к элементу с ошибкой
        feedbackList.childNodes[index].classList.add('invalid');
        feedbackList.childNodes[index].classList.remove('valid');
      } else {
        feedbackList.childNodes[index].classList.add('valid');
        feedbackList.childNodes[index].classList.remove('invalid');
      }
    });
    if (errors.length !== 0) {
      item.setCustomValidity(errors.join('. '))
    } else {
      item.setCustomValidity('')
    }
  }

  start() {
    //Создаем элементы с обратной связью
    this.feedback();
    //Вешаем обрабочики на элементы
    this.elements.forEach(item => {
      item.addEventListener('input', () => {
        this.checkValidity(item)
      })
    });
    //Вешаем обрабочик форму
    this.form.addEventListener('submit', e => {
      this.stopSubmit = false;

      // Вызываю функцию пробегающую по инпутам и проверяющую их
      this.elements.forEach(item => {
        this.checkValidity(item)
      });

      //Если была найдена ошибка то форма не отправляется
      if (this.stopSubmit) {
        e.preventDefault();
      }
    });
  }
}

//Обьект с массивами правил
const rules = {
  name: [
    {
      isInvalid: function (element) {
        const illegalCharacters = element.value.match(/[^a-zA-Z]/g);
        return !!illegalCharacters;
      },
      invalidityMessage: 'Вводить можно только английские буквы'
    },
    {
      isInvalid: function (element) {
        return element.value.length < 5 | element.value.length > 20;
      },
      invalidityMessage: 'Это поле должно содержать больше 5 но меньше 20 символов'
    }
  ],
  phone: [
    {
      isInvalid: function (element) {
        const illegalCharacters = /\+7\(\d{3}\)\d{3}-\d{4}/.test(element.value);
        return !illegalCharacters;
      },
      invalidityMessage: 'Номер должен соответствовать шаблону +7(000)000-0000'
    },
    {
      isInvalid: function (element) {
        return element.value.length !== 15;
      },
      invalidityMessage: 'Номер должен состоять из 15 символов'
    }
  ],
  email: [
    {
      isInvalid: function (element) {
        console.log('rule 3');
        const illegalCharacters = element.value.search(/\w+(?:\.|\-?)\w+@mail\.ru/) === -1;
        return !!illegalCharacters;
      },
      invalidityMessage: 'Email должен соответствовать шаблону *.|-*@mail.ru'
    }
  ]
};
//Вызываем конструктор и передаем в него класс формы, data-attr и правила
const formValidation = new CustomValidation('.form', 'validate', rules);

//Вызываем метод
formValidation.start();

/*
 * Первое задание
 */

const inp = document.querySelector('.input');
const out = document.querySelector('.out');
inp.value = `Some humans would do anything to see if it was possible to do it.\nIf you put a large switch in some cave somewhere, with a sign on it saying\n'End-of-the-World Switch. PLEASE DO NOT TOUCH', the paint wouldn't even have time to dry.`;
out.innerHTML = inp.value.replace(/(?<![А-ЯЁа-яё\w])'|'(?![А-ЯЁа-яё\w])/gm, '<span class="quotes">"</span>');

inp.addEventListener('input', (e) => {
  console.log(e.target.value);
  out.innerHTML = `${e.target.value}`.replace(/(?<![А-ЯЁа-яё\w])'|'(?![А-ЯЁа-яё\w])/gm, '<span class="quotes">"</span>')
});
