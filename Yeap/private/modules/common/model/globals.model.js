define([
    'base_model'
], function (mBase) {


    // Web services endpoint constant definition
    var _prompts = 0;

    return {
        SetPrompts: function () { _prompts = 1 },
        GetPrompts: function () {
            return _prompts == 1;
        }
    }
})