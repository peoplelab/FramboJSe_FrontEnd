using System.Collections.Generic;
using System.Web.Hosting;
using System.Xml;

namespace Yeap.App_Code.Common.Routing
{
    /// <summary>
    /// Routing handler.
    /// </summary>
    public static class Routing
    {
        private const string XML_ROUTES_FILE = "\\app_data\\routing.xml";       // path of routing xml file

        /// <summary>
        /// struct of routing element
        /// </summary>
        private struct sRouting
        {
            private string _name;
            private string _virtual;
            private string _physical;

            /// <summary>
            /// Route Name
            /// </summary>
            public string Name
            {
                get
                {
                    return this._name;
                }
                set
                {
                    this._name = value;
                }
            }
            /// <summary>
            /// Virtual path.
            /// </summary>
            public string Virtual
            {
                get
                {
                    return this._virtual;
                }
                set
                {
                    this._virtual = value;
                }
            }
            /// <summary>
            /// Physical path.
            /// </summary>
            public string Physical
            {
                get
                {
                    return this._physical;
                }
                set
                {
                    this._physical = value;
                }
            }
        }

        public static void RegisterRoutes(System.Web.Routing.RouteCollection routes)
        {
            List<sRouting> routing_list = GetRoutingList();

            foreach (sRouting routing_element in routing_list)
            {
                routes.MapPageRoute(routing_element.Name, routing_element.Virtual, routing_element.Physical);
            }
        }

        /// <summary>
        /// Builds the routing list (from routing xml file)
        /// </summary>
        /// <returns>a list of "routing" elements</returns>
        private static List<sRouting> GetRoutingList()
        {
            List<sRouting> routing_list = new List<sRouting>();

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(HostingEnvironment.ApplicationPhysicalPath + XML_ROUTES_FILE);
            XmlNodeList itemNodes = xmlDoc.SelectNodes("//routes/route");
            if (itemNodes != null && itemNodes.Count > 0)
            {
                foreach (XmlNode itemNode in itemNodes)
                {
                    XmlNode nName = itemNode.SelectSingleNode("name");
                    XmlNode nVirtual = itemNode.SelectSingleNode("virtual");
                    XmlNode nPhysical = itemNode.SelectSingleNode("physical");
                    if ((nName != null))
                    {
                        sRouting routing_element = new sRouting();
                        routing_element.Name = nName.InnerText;
                        routing_element.Virtual = nVirtual.InnerText;
                        routing_element.Physical = nPhysical.InnerText;

                        routing_list.Add(routing_element);
                    }
                }
            }

            return routing_list;
        }
    }
}