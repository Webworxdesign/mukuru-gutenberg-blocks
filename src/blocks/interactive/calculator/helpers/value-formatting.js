export default function valueFormatting(num) {
    num = String(num)
    let newNum = num
    let numLength = newNum.indexOf('.') > 0 ? num.length - 3 : num.length
    let index = newNum.indexOf('.') > 0 ? - 6 : -3

    //Set loop amount based off how many sets of 1000s are in the number
    let loopCount = Math.round(  numLength / 3 )		

    for (let i = 0; i < loopCount; i++) {
        //Add comma
        if(num.length >= 4) {
            newNum = [newNum.slice(0, index), ',', newNum.slice(index)].join('');
        }
        index -= 4
    }
    //Replace first instance of ',' if at index 0
    if(newNum.indexOf(',') == 0) {
        newNum = newNum.replace(',',' ')
    } 

    return newNum 
}