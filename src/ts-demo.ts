interface IInfo {
  // name: string;
  // age: number;
  [key: string]: boolean;
}
type Age = number;
type userInfo = {
  age: Age;
};
function tsFunc() {
  console.log('haha');
  // const c = [true, false];
  const a: unknown = 10;
  const b = a === 20;
  // const c = a + 10; //Operator '+' cannot be applied to types 'unknown' and '10'.，如果是any，这里不会报错，这个体现了unknown再次确认的特性
  if (typeof a === 'number') {
    const d = a + 10;
    console.log(d); //这里不会报错，因为告诉了编译器a是一个number
  }
  const person = new Person('qiu', 'sen');
  console.log(person.getFullName());
  //{ isMan: false, isWoMan: true }
  const info: IInfo = {
    // name: 'zahgnsan',
    // age: 111,
    isMan: false,
    isWoMan: true,
  };
  console.log(info);
}

class Person {
  /**类中的构造函数
   * 简写了:
   * this.firstName = firstName
   * this.secondName = secondName
   */
  constructor(public firstName: string, public secondName: string) {}
  getFullName() {
    return 'fullName:' + this.firstName + this.secondName;
  }
}

type Reserve = {
  (from: Date, to: Date, destination: string): void;
  (from: Date, destination: string): void;
};
type MyEvent<T> = {
  target: T;
  type: string;
};
type ButtonEvent = MyEvent<HTMLButtonElement>;
interface IAnimal1 {
  showName(): string;
}
interface IAnimal2 {
  showAge(): number;
}
abstract class Animal implements IAnimal1, IAnimal2 {
  constructor(public name: string) {}

  run(): this {
    console.log(this.name + ' animal run ');
    return this;
  }

  abstract eat();

  showAge(): number {
    return 0;
  }

  showName(): string {
    return '';
  }
}

class Dog extends Animal {
  eat() {
    console.log('#################');
    super.run();
    console.log('dog eat');
  }
}

export const doIt = () => {
  tsFunc();
  //实现的时候一个函数兼容两个函数，第三个函数选填
  const reserve: Reserve = (from, toOrDestination, destination?: string) => {
    console.log(from, toOrDestination, destination);
    if (toOrDestination instanceof Date && destination !== undefined) {
      //预定往返
      console.log('往返');
    } else {
      //预定单程
      console.log('单程');
    }
  };
  reserve(new Date(), 'wuhan');
  reserve(new Date(), new Date(), 'wuhan');

  const promise = new Promise<number>((resolve) => resolve(45));
  promise.then((result) => result * 4);
  // const myEvent: MyEvent<HTMLButtonElement | null> = {
  //   target: document.querySelector('#test'),
  //   type: 'click',
  // };
  const dog = new Dog('wangwang');
  dog.run().eat();
};
