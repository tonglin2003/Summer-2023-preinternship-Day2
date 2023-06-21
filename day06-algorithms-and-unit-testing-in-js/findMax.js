function findMax(arr)
{
    if (arr.length < 1) return null;
    else if (arr.length === 1) return arr[0];
    else
    {
        let max = arr[0];
        for (let num of arr)
        {
            if (num > max) max = num;
        }
        return max;
    }

}
module.exports = findMax