const stopBtn = document.querySelector('.btn--stop');
const startBtn = document.querySelector('.btn--start');
const message = document.querySelector('.screen__message');
const waterAmount = document.querySelector('.water__amount');
const grainAmount = document.querySelector('.grain__amount');
const waterError = document.querySelector('.error--water');
const grainError = document.querySelector('.error--coffee');
stopBtn.addEventListener('click', () => {
  vitek.stop();
});
startBtn.addEventListener('click', () => {
  vitek.launch();
});

class CoffeeMachine {
  constructor(power) {
    this.power = power;
    //Количество кофе (одна порция, двойная)
    this.portions = 1;
    // Переменная отвечающая за протекающий процесс
    this.process = false;
    // Объект отвечающий за кофе
    this.grain = {
      current: 0,
      max: 300,
      portion: 8,
      unit: 'g.'
    };
    // Объект отвечающий за воду
    this.water = {
      current: 0,
      max: 1800,
      portion: 150,
      unit: 'ml.'
    };
    this.waterHeatCapacity = 4200;
    // Комнатная температура
    this.roomTemp = 20;
    this.maxTemp = 90;
    // Tаймер
    this.timer = null;
  }

  getBoilTime() {
    return (this.water.portion * this.waterHeatCapacity * (this.maxTemp - this.roomTemp)) / this.power
  };

  checkWater() {
    waterAmount.style.transform = `scaleY(${this.water.current/this.water.max})`;
    if (this.water.current < this.water.portion) {
      waterError.classList.add('active');
      console.error('Налейте воды');
      return false;
    }
    return true;
  };

  checkGrain(portions = 1) {
    grainAmount.style.transform = `scaleY(${this.grain.current/this.grain.max})`;
    if (this.grain.current < this.grain.portion * portions) {
      grainError.classList.add('active');
      console.error('Добавьте кофе');
      return false;
    }
    return true;
  };

  addWater(newAmount) {
    this.water.current += newAmount;
    this.checkWater()
  };

  addCoffee(newAmount) {
    this.grain.current += newAmount;
    this.checkGrain()
  };

  launch(portions = 1) {
    if(this.process) {
      message.innerText = `Идет приготовление`;
      return
    }
    this.process = true;
    if (!(this.checkWater() && this.checkGrain(portions))) {
      return
    }
    const boilTime = this.getBoilTime();
    message.innerText = `Время приготовления: ${Math.floor(boilTime / 1000)}с`;
    this.timer = setTimeout(() => {
      message.innerText = 'Ваш кофе готов';
      this.water.current -= this.water.portion;
      this.grain.current -= this.grain.portion * portions;
      this.checkWater();
      this.checkGrain();
      this.process = false;
    }, boilTime);
  }

  stop() {
    clearTimeout(this.timer);
    this.process = false;
    message.innerText = 'Вы отменили действие';
  }
}
const vitek = new CoffeeMachine(10000);
vitek.addWater(320);
vitek.addCoffee(100);
