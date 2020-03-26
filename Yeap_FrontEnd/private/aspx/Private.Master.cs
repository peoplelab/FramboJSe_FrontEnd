using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Yeap_FrontEnd.MasterPages
{
	public partial class Private : System.Web.UI.MasterPage {

		#region main variables
		public string ExportVersion = "";
		
		// ** fwSource: contiene l'URL del kernel del framework
		// ** Normalmente dev'essere la versione in PROD, in quanto il framework è predefinito e indipendente dallo sviluppo della parte APP
		// ** Per esigenze particolari si può puntare al framework in locale (sviluppo) o in test decommentando la riga opportuna qui sotto

		static string fwSource = "";														// Framework nel repository della APP: deprecato
		//static string fwSource = "https://localhost:9000";									// Framework locale (sviluppo del framework)
	//	static string fwSource = "https://test-frambojse.people-manager.it:9000";			// Framework in test (preprod)
	//	static string fwSource = "https://frambojse.people-manager.it:9000";				// Framework ufficiale (ambiente di produzione)
		
		public string[] Lib_js  = new string[] {
			fwSource + "/System/3rd-parties/jquery/jquery.min.js", 
			fwSource + "/System/3rd-parties/jquery-ui/jquery-ui.min.js", 
			fwSource + "/System/3rd-parties/bootstrap/js/bootstrap.bundle.min.js", 
			fwSource + "/System/3rd-parties/jscookie/js.cookie.js", 
			fwSource + "/System/3rd-parties/fontawesome/js/fontawesome-all.min.js", 
			fwSource + "/System/3rd-parties/system/system.js"
		};
		public string[] Lib_css = new string[] {
			fwSource + "/System/3rd-parties/jquery-ui/jquery-ui.min.css", 
			fwSource + "/System/3rd-parties/bootstrap/css/bootstrap.min.css",
            fwSource + "/System/3rd-parties/bootstrap/css/bootstrap-directional-buttons.min.css",
            fwSource + "/System/3rd-parties/fontawesome/css/fa-svg-with-js.css"
		};
		public string[] Sys_js  = new string[] {
			"/public/config.pub.js",
			"/private/config.pvt.js",
			fwSource + "/System/config.sys.js",
			fwSource + "/System/framboJSe.fw/libs/js/main.sys.js"
		};

	//	public string[] Lib_js  = new string[] {
	//		"/System/3rd-parties/jquery/jquery.min.js", 
	//		"/System/3rd-parties/jquery-ui/jquery-ui.min.js", 
	//		"/System/3rd-parties/bootstrap/js/bootstrap.bundle.min.js", 
	//		"/System/3rd-parties/jscookie/js.cookie.js", 
	//		"/System/3rd-parties/fontawesome/js/fontawesome-all.min.js", 
	//		"/System/3rd-parties/system/system.js"
	//	};
	//	public string[] Lib_css = new string[] {
	//		"/System/3rd-parties/jquery-ui/jquery-ui.min.css", 
	//		"/System/3rd-parties/bootstrap/css/bootstrap.min.css", 
	//		"/System/3rd-parties/fontawesome/css/fa-svg-with-js.css"
	//	};
	//	public string[] Sys_js  = new string[] {
	//		"/public/config.pub.js",
	//		"/private/config.pvt.js",
	//		"/System/config.sys.js",
	//		"/System/framboJSe.fw/libs/js/main.sys.js"
	//	};
		public string[] Sys_css = new string[] {
		};
		public string[] Pvt_js  = new string[] {
		};
		public string[] Pvt_css = new string[] {
			"/private/resources/css/overrides.pvt.min.css",
			"/private/resources/css/tipografici.pvt.min.css",
			"/private/resources/css/strutturali.pvt.min.css",
			"/private/resources/css/graphics.pvt.min.css",
			"/private/resources/css/fromYeap.pvt.min.css",
		};

		#endregion

		#region main class
		public class DeclareFiles {

			#region Dichiarazioni variabili

			private readonly string[] TAG_JS  = {"<script type=\"text/javascript\" src=\"", "\"></script>"};
			private readonly string[] TAG_CSS = {"<link rel=\"stylesheet\" type=\"text/css\" href=\"", "\" />"};
			private const byte BUILD_JS  = 0;
			private const byte BUILD_CSS = 1;
	
			private string[] _js  = new string[] {};
			private string[] _css = new string[] {};
			private string   _ver = "";

			#endregion

	        #region Properties

			public string Js  { 
				get { return this.buildTags(BUILD_JS); } 
			}
			public string Css {
				get { return this.buildTags(BUILD_CSS); } 
			}

	        #endregion
			
			#region Constructors 

			public DeclareFiles(string[] js, string[] css, string ver) { 
				
				this._js  = js;
				this._css = css;
				this._ver = ver;

			}

			#endregion

			#region Public Methods
			private string buildTags (byte id) {

				string[] fileList = new string[]{ };
				string   tagInit  = "";
				string   tagClose = "";

				switch (id) {
					case BUILD_JS:
						tagInit  = TAG_JS[0];
						tagClose = TAG_JS[1];
						fileList = this._js;
						break;

					case BUILD_CSS:
						tagInit  = TAG_CSS[0];
						tagClose = TAG_CSS[1];
						fileList = this._css;
						break;

					default:
						break;
				}

				StringBuilder htmlString = new StringBuilder();
				foreach (string fileName in fileList) {
				//htmlString.Append("\t");
					htmlString
						.Append(tagInit)
						.Append(fileName)
						.Append(this._ver)
						.Append(tagClose)
						.Append("\n\t");
				}
				htmlString.Append("\n\t");

				return htmlString.ToString();

			}
			#endregion
			
		}
		#endregion

		public const byte JS_FILES  = 0;
		public const byte CSS_FILES = 1;

		public string Mayor    = "";
		public string Minor    = "";
		public string Build    = "";
		public string Revision = "";
		public string Version  = "";

		public string[] LibFiles = new string[] {"", ""};
		public string[] SysFiles = new string[] {"", ""};
		public string[] PvtFiles = new string[] {"", ""};


		protected void Page_Init(object sender, EventArgs e) {
			
			Assembly assem = typeof(Private).Assembly;
			AssemblyName assemName = assem.GetName();
			
			this.Mayor    = assemName.Version.Major.ToString("0");
			this.Minor    = assemName.Version.Minor.ToString("0");
			this.Build    = assemName.Version.Build.ToString("0");
			this.Revision = assemName.Version.Revision.ToString("0");
			this.Version  = "?v=" + Revision;

			ExportVersion = Version;

		}

		protected void Page_Load(object sender, EventArgs e) {

			// Definizione degli insiemi di tag
			DeclareFiles Lib = new DeclareFiles(Lib_js, Lib_css, "?v=" + Mayor);
				LibFiles[JS_FILES]  = Lib.Js;
				LibFiles[CSS_FILES] = Lib.Css;

		//	DeclareFiles Sys = new DeclareFiles(Sys_js, Sys_css, "?v=" + Build);
			DeclareFiles Sys = new DeclareFiles(Sys_js, Sys_css, "?v=" + Revision);
				SysFiles[JS_FILES]  = Sys.Js;
				SysFiles[CSS_FILES] = Sys.Css;

			DeclareFiles Pvt = new DeclareFiles(Pvt_js, Pvt_css, "?v=" + Revision);
				PvtFiles[JS_FILES]  = Pvt.Js;
				PvtFiles[CSS_FILES] = Pvt.Css;

		}
	}
}