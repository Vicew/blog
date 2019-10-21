// const _ = require('lodash')

// let obj = {
//   a: null,
//   b: "test",
//   c: undefined,
//   d: 123,
//   e: "",
//   f: {},
// }

// for(let key in obj){
//   if(!obj[key]){
//     delete obj[key]
//   }
// }

// console.log(obj)

// obj = _.pickBy(obj, prop => prop)
// console.log(obj)

const arr = [1,2,[3,4,[5,6,7],8],9]

const flatten = (arr)=>{
  return arr.reduce((accumulator, currentValue)=>{
    return Array.isArray(currentValue) ? [...accumulator,...flatten(currentValue)] : [...accumulator,currentValue]
  },[])
}

const result = flatten(arr)

console.log(result)