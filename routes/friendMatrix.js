var findDuplicate = function (arr1, arr2) {
    var duplicateValue = [];

    var len1 = arr1.length,
        len2 = arr2.length;

    var i = 0, j = 0;

    //arr1 and arr2 art pre-sorted
    while (i < len1 && j < len2) {
        if (arr1[i] > arr2[j]) {
            j++;
        }
        else if (arr1[i] < arr2[j]) {
            i++;
        }
        else {
            duplicateValue.push(arr1[i]);
        }
    }

    return duplicateValue;
};

exports.makeMatrix = function (friendList, userList, callback) {
    //array, int
    var curUserFriendList = friendList,
    //array, int
        wholeUserList = userList;

    //ascending order sort
    wholeUserList.sort(function (a, b) {
        return a - b
    });

    callback(findDuplicate(curUserFriendList, wholeUserList));
};