// sitemap.controller.js -> controller for page sitemap

define([
    'templatesHandler',
    'base_controller'
],
    function (th, cBase) {

        var _template_pvt = 2001;   // template public code (const)
        var _template_pub = 2002;   // template private code (const)

        var _node_id = "";          // node we are searching for...
        var _template_code;         // sitemap template code
        var _currentNode;           // current node (corresponding to node_id) in the sitemap.xml file
        var _parentNode;            // parent node (of _currentNode) in the sitemap.xml file
        var _childrenNode = [];     // children node (of _currentNode) in the sitemap.xml file
        var _xmlRaw = '';           // sitemap tree (global for GetGeneric node function)

        return {
            Init: init,             // module initialization
            Get: get,               // get sitemap values for node_id

            Current: getCurrent,
            Parent: getParent,      // get node parent
            Children: getChildren,  // get children node

            GetGeneric: getGeneric  // get generic node (outside of current...)
        }


        // function: init -> module initialization.
        // param: node_id -> node we are searching for... 
        // param: template_code -> special template code for sitemap (other than 'public' or 'private'... )
        // return value -> none.
        function init(params) {
            _node_id = params.node_id;
            _template_code = (params.template_code == null) ? __PageScope : params.template_code;
        }

        // function: get -> get sitemap values for node_id.
        // param: params are all "variables" values, values that depend on the page: detail code for the page (i.e. "subject id" for subject), 
        // groupN text, labelX text.
        // return value -> none, but an asynchronous request will be made.
        function get(params) {

            // scope sitemap choice...
            var template_code = (_template_code == 'private') ? _template_pvt : _template_pub;

            // from a node id, get the text array and url array
            th.Render({
                code: template_code,
                XML: $.parseXML(getXML(params)),
                onSuccess: function (result) {
                    _xmlRaw = result;
                    var arr = buildArrays({ node_id: _node_id, xml_raw: result });
                    params.onSuccess(arr);
                },
                onFailed: function (result) {
                    cBase.OnGenericFailure({ ResponseCode: result.code, ResponseMessage: result.descr, FailureCode: result.code, RawData: '' });
                }                
            });
        }
        // function: getXML -> make the xml "values" for sitemap template.
        // param: params are all "variables" values, values that depend on the page: detail code for the page (i.e. "subject id" for subject), 
        // groupN text, labelX text.
        // return value -> xml string.
        function getXML(params) {
            //var nodeid = params.node_id;
            var subject_id = (params.subject_id == null) ? "" : params.subject_id;
            var subject_name = (params.subject_name == null) ? "" : params.subject_name;
            var g1_text = (params.g1_text == null) ? "" : params.g1_text;
            var g2_text = (params.g2_text == null) ? "" : params.g2_text;
            var g3_text = (params.g3_text == null) ? "" : params.g3_text;
            var g4_text = (params.g4_text == null) ? "" : params.g4_text;
            var g5_text = (params.g5_text == null) ? "" : params.g5_text;
            var g6_text = (params.g6_text == null) ? "" : params.g6_text;
            var g7_text = (params.g7_text == null) ? "" : params.g7_text;
            var g8_text = (params.g8_text == null) ? "" : params.g8_text;
            var g9_text = (params.g9_text == null) ? "" : params.g9_text;
            var g10_text = (params.g10_text == null) ? "" : params.g10_text;
            var deadline_code = (params.deadline_code == null) ? "" : params.deadline_code;
            var f_code = (params.f_code == null) ? "" : params.f_code;
            var label_x1 = (params.label_x1 == null) ? "" : params.label_x1;
            var label_x2 = (params.label_x2 == null) ? "" : params.label_x2;
            var ts_ass_code = (params.ts_ass_code == null) ? "" : params.ts_ass_code;
            var ts_ass_uid = (params.ts_ass_uid == null) ? "" : params.ts_ass_uid;
            var ts_ass_uname = (params.ts_ass_uname == null) ? "" : params.ts_ass_uname;
            var conf_edit_code = (params.conf_edit_code == null) ? "" : params.conf_edit_code;
            var filter_month = (params.filter_month == null) ? "" : params.filter_month;
            var filter_year = (params.filter_year == null) ? "" : params.filter_year;


            var strxml = "";

            strxml += "<response>";
            strxml += " <result>";
            strxml += "  <codice>0</codice>";
            strxml += "  <descrizione></descrizione>";
            strxml += " </result>";
            strxml += " <data>";
            strxml += "  <subject_id>" + subject_id + "</subject_id>";
            strxml += "  <subject_name>" + subject_name + "</subject_name>";
            strxml += "  <g1_text>" + g1_text + "</g1_text>";
            strxml += "  <g2_text>" + g2_text + "</g2_text>";
            strxml += "  <g3_text>" + g3_text + "</g3_text>";
            strxml += "  <g4_text>" + g4_text + "</g4_text>";
            strxml += "  <g5_text>" + g5_text + "</g5_text>";
            strxml += "  <g6_text>" + g6_text + "</g6_text>";
            strxml += "  <g7_text>" + g7_text + "</g7_text>";
            strxml += "  <g8_text>" + g8_text + "</g8_text>";
            strxml += "  <g9_text>" + g9_text + "</g9_text>";
            strxml += "  <g10_text>" + g10_text + "</g10_text>";
            strxml += "  <deadline_code>" + deadline_code + "</deadline_code>";
            strxml += "  <f_code>" + f_code + "</f_code>";
            strxml += "  <label_x1>" + label_x1 + "</label_x1>";
            strxml += "  <label_x2>" + label_x2 + "</label_x2>";
            strxml += "  <ts_ass_code>" + ts_ass_code + "</ts_ass_code>";
            strxml += "  <ts_ass_uid>" + ts_ass_uid + "</ts_ass_uid>";
            strxml += "  <ts_ass_uname>" + ts_ass_uname + "</ts_ass_uname>";
            strxml += "  <conf_edit_code>" + conf_edit_code + "</conf_edit_code>";
            strxml += "  <filter_month>" + filter_month + "</filter_month>";
            strxml += "  <filter_year>" + filter_year + "</filter_year>";
            strxml += " </data>";
            strxml += "</response>";

            return strxml;
        }


        // function: buildArrays -> parse the sitemap xml file and build the result array.
        // param: node_id -> node we are searching for...
        // param: xml_raw -> sitemap xml file in a string format.
        // return value -> array of :
        //                  {
        //                   id,   -> node id 
        //                   text, -> node text
        //                   url   -> node url 
        //                  } 
        function buildArrays(params) {
            var node_id = params.node_id;
            var xml_raw = params.xml_raw;
            var ret_value = [];

            var xmlDoc = $.parseXML(xml_raw);
            var xml = $(xmlDoc);

            var start_node = xml.find("page[id=" + node_id + "]");

            $(start_node).each(function () {

                var id = $(this).attr("id");
                var text = $(this).attr("text");
                var url = $(this).attr("url");
                _currentNode = { id: id, text: text, url: url };
                ret_value.push(_currentNode);

                var parents = $(this).parents();
                // i'm searching for "page" nodes only, others are discarded
                var counter = 1;
                $(parents).each(function () {
                    if (this.nodeName == "page") {
                        id = $(this).attr("id");
                        text = $(this).attr("text");
                        url = $(this).attr("url");
                        var node = { id: id, text: text, url: url };
                        if (counter == 1) {
                            _parentNode = node;
                        }
                        ret_value.push(node);
                        counter++;
                    }
                    else {
                        return;
                    }
                });

                var children = $(this).children();
                $(children).each(function () {
                    id = $(this).attr("id");
                    text = $(this).attr("text");
                    url = $(this).attr("url");
                    var node = { id: id, text: text, url: url };
                    _childrenNode.push(node);
                });
            });

            return ret_value;


        }


        function getCurrent() {
            return _currentNode;
        }
        function getParent() {
            return _parentNode;
        }
        function getChildren() {
            return _childrenNode;
        }

        function getGeneric(params) {
            var node_id = params.node_id;
            var ret_value = [];

            var xmlDoc = $.parseXML(_xmlRaw);
            var xml = $(xmlDoc);

            var start_node = xml.find("page[id=" + node_id + "]");

            $(start_node).each(function () {
                var id = $(this).attr("id");
                var text = $(this).attr("text");
                var url = $(this).attr("url");

                var currentNode = { id: id, text: text, url: url };
                ret_value.push(currentNode);
            });

            return ret_value;
        }
    });


