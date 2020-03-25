// input_kernel.js -> kernel definition for "input" snippets 
// target:  <snp_ctrls_input />
// funct.:  Input field preformato...
// output:  Input group
define ([], function() {

    return {
        Build: buildHtml
    }


    // FUNCTION: buildHtml
    //  builds the input field's HTML code 
    // PARAMS:
    //  kPars : kernel's configuration parameters (in JSON format)
    //  tPars : input tag's specific parameters (e.g.: value) in JSON format
    // RETURN:
    //  myHtnml : HTML formatted code as simple text (syncronous mode) or promise (asyncronous mode)
    function buildHtml(kPars, tPars) {
    
        var enabled, classes, html, v;

        // Sets specific attributes for disabled or enabled fields
        enabled  = (kPars.Attrs.toLowerCase().indexOf('disabled') > -1) ? false : true;
        
        classes  = 'form-control ' + kPars.Class;                       // Builds "class" attribute
        classes += (enabled)? ' cleanInput ' : '';

        // HTML definition
        html  = '<input';                                               // Defines attrs:
        html += ' type="'  + kPars.Input + '"';                         // type
        html += ' class="' + classes + '"';                             // class

        v = ((tPars.value != null) ? tPars.value : 'null');
        html += ' value="' + v + '"';                                   // value
        html += ((enabled)? ' ov="' + v + '" ' : '');                   // ov

        if (tPars.key != null) {
            html += ' id="' + tPars.key + '"';                          // id
            html += ' key="' + tPars.key + '"';                         // key
        }
        html += kPars.Attrs + '>';                                      // Others attrs

        // Return value
        return html;

    }

});