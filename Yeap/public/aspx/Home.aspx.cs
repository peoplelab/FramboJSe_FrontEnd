using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Yeap.Pages
{
    public partial class Login : System.Web.UI.Page
    {
        private string TOKENCOOKIENAME = "Redirect_cookie";


        protected void Page_Load(object sender, EventArgs e)
        {
            SetBypassSslCertificateValidation();


            string token;
            using (var reader = new StreamReader(Request.InputStream))
                token = reader.ReadToEnd();

            //   string token = Request.QueryString[TOKEN_KEY];

            if (token?.Length > 0)
            {
                string tokenSerialized = "";
                this.setUserToken(tokenSerialized, token);
                // Ridirige all'URL che ha causato il login oppure all'home page

                string qs = "";
                //foreach (string key in Request.QueryString.Keys)
                //{
                //    qs += key + "=" + Request.QueryString[key];
                //    qs += "&";
                //}
                qs = Uri.UnescapeDataString(token);
                qs = "?" + qs.Substring(0, qs.Length - 1);


                // c'è un problema nel framework in quanto l'url di redirect originale può venire considerato "Pericoloso" e quindi il
                // redirect non viene fatto (https://developers.de/blogs/damir_dobric/archive/2008/08/29/formsauthentication-and-dangerousurl-issue.aspx)
                if (IsDangerousUrl(Request.QueryString["ReturnUrl"]) == false)
                {
                    HttpContext.Current.Response.Redirect(
                     FormsAuthentication.GetRedirectUrl(token, true));


                    //HttpContext.Current.Response.Redirect(
                    //  FormsAuthentication.GetRedirectUrl(token, true) + qs);

                }
                else
                {
                    Response.Redirect(FormsAuthentication.DefaultUrl + qs);
                }

            }
        }

        private void SetBypassSslCertificateValidation()
        {
            ServicePointManager.ServerCertificateValidationCallback
                += new RemoteCertificateValidationCallback(BypassSslCertificateValidation);
        }

        private bool BypassSslCertificateValidation(object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors error)
        {
            return true;
        }
        private void setUserToken(string tokenSerialized, string token)
        {
            //   Yeap.App_Code.Common.Settings.ApplicationSettings sett = Yeap.App_Code.Common.Settings.ApplicationSettings.GetInstance();
            // il timeout del cookie viene preso dal web.config (impostazione classica)
            //  int timeout = sett.AuthenticationFormsDefaultTimeout; // legge il valore del timeout dal web.config
            int timeout = 30;// è il timeout del token(in realtà  si trova nel file web.config, ma siccome adesso non leggo il file web.config da questa class, è stato messo a mano).
            // Crea il ticket di autenticazione
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                1, token, System.DateTime.Now, DateTime.Now.AddMinutes(timeout),
                true, tokenSerialized, FormsAuthentication.FormsCookiePath);
            // Produce la stringa crittografata a partire dal ticket,
            // utilizzabile come cookie
            string enc = FormsAuthentication.Encrypt(ticket);
            // Crea il cookie e lo aggiunge all'insieme dei cookie
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, enc);
            if (ticket.IsPersistent)
                cookie.Expires = ticket.Expiration;
            cookie.Path = FormsAuthentication.FormsCookiePath;
            cookie.Secure = FormsAuthentication.RequireSSL;

            HttpContext.Current.Response.Cookies.Add(cookie);

            HttpContext.Current.Response.Cookies.Add(new HttpCookie(TOKENCOOKIENAME, token));
        }

        /// <summary>
        /// un url viene definito "pericoloso" se contiene caratteri particolari...
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        internal static bool IsDangerousUrl(string s)
        {
            if (String.IsNullOrEmpty(s))
            {
                return false;
            }

            // Trim the string inside this method, since a Url starting with whitespace
            // is not necessarily dangerous.  This saves the caller from having to pre-trim
            // the argument as well.
            s = s.Trim();

            int len = s.Length;

            if ((len > 4) &&
                ((s[0] == 'h') || (s[0] == 'H')) &&
                ((s[1] == 't') || (s[1] == 'T')) &&
                ((s[2] == 't') || (s[2] == 'T')) &&
                ((s[3] == 'p') || (s[3] == 'P')))
            {
                if ((s[4] == ':') ||
                    ((len > 5) && ((s[4] == 's') || (s[4] == 'S')) && (s[5] == ':')))
                {
                    return false;
                }
            }

            int colonPosition = s.IndexOf(':');
            if (colonPosition == -1)
            {
                return false;
            }
            return true;
        }
    }
}