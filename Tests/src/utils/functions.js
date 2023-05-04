const add = (a,b) =>{
    return a+b;
}

const digitsInNumber = (num)=>{
    return num.toString().replaceAll("-","").length;
}


module.exports = {add,digitsInNumber}