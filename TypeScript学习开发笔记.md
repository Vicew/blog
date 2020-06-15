---
title: TypeScript学习开发笔记
date: 2020-05-28 09:20:38
tags: TypeScript
categories: TypeScript
---

## Null 和 Undefined

在 TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型：

```typescript
let u: undefined = undefined;
let n: null = null;
```

与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量：

```typescript
// 这样不会报错
let num: number = undefined;
```

```typescript
// 这样也不会报错
let u: undefined;
let num: number = u;
```

而 void 类型的变量不能赋值给 number 类型的变量：

```typescript
let u: void;
let num: number = u;

// Type 'void' is not assignable to type 'number'.
```

## 未声明类型的变量

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：

```typescript
let something;
something = 'seven';
something = 7;

something.setName('Tom');
```

等价于

```typescript
let something: any;
something = 'seven';
something = 7;

something.setName('Tom');
```

但是在赋值之后~就不一样了。 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。这就是类型推断

以下代码虽然没有指定类型，但是会在编译的时候报错：

```typescript
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：

```typescript
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

## 接口任意属性

有时候我们希望一个接口允许有任意的属性，可以使用如下方式：

```typescript
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

使用 `[propName: string]` 定义了任意属性取 string 类型的值。

需要注意的是，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：**

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

// Property 'age' of type 'number | undefined' is not assignable to string index type 'string'.(2411)

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

//Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//  Property 'age' is incompatible with index signature.
//    Type 'number' is not assignable to type 'string'.(2322)
```

上例中，任意属性的值允许是 `string`，但是可选属性 `age` 的值却是 `number` 或者 `undefined`，它们不是 `string` 的子属性，所以报错了。

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：
```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number | undefined;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
```

## 用接口表示数组

接口也可以用来描述数组：

```typescript
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

NumberArray 表示：只要索引的类型是数字时，那么值的类型必须是数字。

虽然接口也可以用来描述数组，但是我们一般不会这么做，因为这种方式比前两种方式复杂多了。

不过有一种情况例外，那就是它常用来表示类数组。

类数组（Array-like Object）不是数组类型，比如 arguments：

```typescript
function sum() {
    let args: number[] = arguments;
}

// Initializer type IArguments is not assignable to variable type number[] 
```

上例中，arguments 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口：

```typescript
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```

在这个例子中，我们除了约束当索引的类型是数字时，值的类型必须是数字之外，也约束了它还有 length 和 callee 两个属性。

事实上常用的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等：

```typescript
function sum() {
    let args: IArguments = arguments;
}
```

其中 IArguments 是 TypeScript 中定义好了的类型，它实际上就是：

```typescript
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

## 可选参数

前面提到，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？

与接口中的可选属性类似，我们用 ? 表示可选的参数：

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

需要注意的是，可选参数必须接在必需参数后面。换句话说，**可选参数后面不允许再出现必需参数了：**

```typescript
function buildName(firstName?: string, lastName: string) {
    if (firstName) {
        return firstName + ' ' + lastName;
    } else {
        return lastName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName(undefined, 'Tom');

// A required parameter cannot follow an optional parameter.
```

## 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：

```typescript
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    return x.split('').reverse().join('');
}
```

**然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。**

这时，我们可以使用重载定义多个 reverse 的函数类型：

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    return x.split('').reverse().join('');
}
```

上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

**注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。**


##类型断言的限制

```typescript
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

let tom: Cat = {
    name: 'Tom',
    run: () => { console.log('run') }
};
let animal: Animal = tom;
```

surprise没有报错呢

我们知道，TypeScript 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

在上面的例子中，Cat 包含了 Animal 中的所有属性，除此之外，它还有一个额外的方法 run。TypeScript 并不关心 Cat 和 Animal 之间定义时是什么关系，而只会看它们最终的结构有什么关系——所以它与 Cat extends Animal 是等价的：

```typescript
interface Animal {
    name: string;
}
interface Cat extends Animal {
    run(): void;
}
```

那么也不难理解为什么 Cat 类型的 tom 可以赋值给 Animal 类型的 animal 了——就像面向对象编程中我们可以将子类的实例赋值给类型为父类的变量。

我们把它换成 TypeScript 中更专业的说法，即：Animal 兼容 Cat。

当 Animal 兼容 Cat 时，它们就可以互相进行类型断言了：

```typescript
interface Animal {
    name: string;
}
interface Cat {
    name: string;
    run(): void;
}

function testAnimal(animal: Animal) {
    return (animal as Cat);
}
function testCat(cat: Cat) {
    return (cat as Animal);
}
```

这样的设计其实也很容易就能理解：

- 允许 animal as Cat 是因为「父类可以被断言为子类」，这个前面已经学习过了
- 允许 cat as Animal 是因为既然子类拥有父类的属性和方法，那么被断言为父类，获取父类的属性、调用父类的方法，就不会有任何问题，故「子类可以被断言为父类」

综上所述：

- 联合类型可以被断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型
- 要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可

## 双重断言

- 任何类型都可以被断言为 any
- any 可以被断言为任何类型

那么我们是不是可以使用双重断言 as any as Foo 来将任何一个类型断言为任何另一个类型呢？

```typescript
interface Cat {
    run(): void;
}
interface Fish {
    swim(): void;
}

function testCat(cat: Cat) {
    return (cat as any as Fish);
}
```

在上面的例子中，若直接使用 cat as Fish 肯定会报错，因为 Cat 和 Fish 互相都不兼容。

但是若使用双重断言，则可以打破「要使得 A 能够被断言为 B，只需要 A 兼容 B 或 B 兼容 A 即可」的限制，将任何一个类型断言为任何另一个类型。

若你使用了这种双重断言，那么十有八九是非常错误的，它很可能会导致运行时错误。

**除非迫不得已，千万别用双重断言。**

## 接口继承类

常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

为什么 TypeScript 会支持接口继承类呢？

实际上，当我们在声明 class Point 时，除了会创建一个名为 Point 的类之外，同时也创建了一个名为 Point 的类型（实例的类型）。

所以我们既可以将 Point 当做一个类来用（使用 new Point 创建它的实例）：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const p = new Point(1, 2);
```

也可以将 Point 当做一个类型来用（使用 : Point 表示参数的类型）：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function printPoint(p: Point) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

这个例子实际上可以等价于：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

function printPoint(p: PointInstanceType) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

上例中我们新声明的 PointInstanceType 类型，与声明 class Point 时创建的 Point 类型是等价的。

所以回到 Point3d 的例子中，我们就能很容易的理解为什么 TypeScript 会支持接口继承类了：

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

// 等价于 interface Point3d extends PointInstanceType
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

当我们声明 interface Point3d extends Point 时，Point3d 继承的实际上是类 Point 的实例的类型。

换句话说，可以理解为定义了一个接口 Point3d 继承另一个接口 PointInstanceType。

所以「接口继承类」和「接口继承接口」没有什么本质的区别。

值得注意的是，PointInstanceType 相比于 Point，缺少了 constructor 方法，这是因为声明 Point 类时创建的 Point 类型是不包含构造函数的。另外，除了构造函数是不包含的，静态属性或静态方法也是不包含的（实例的类型当然不应该包括构造函数、静态属性或静态方法）。

换句话说，声明 Point 类时创建的 Point 类型只包含其中的实例属性和实例方法：

```typescript
class Point {
    /** 静态属性，坐标系原点 */
    static origin = new Point(0, 0);
    /** 静态方法，计算与原点距离 */
    static distanceToOrigin(p: Point) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
    /** 实例属性，x 轴的值 */
    x: number;
    /** 实例属性，y 轴的值 */
    y: number;
    /** 构造函数 */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /** 实例方法，打印此点 */
    printPoint() {
        console.log(this.x, this.y);
    }
}

interface PointInstanceType {
    x: number;
    y: number;
    printPoint(): void;
}

let p1: Point;
let p2: PointInstanceType;
```

上例中最后的类型 Point 和类型 PointInstanceType 是等价的。

同样的，在接口继承类的时候，也只会继承它的实例属性和实例方法。