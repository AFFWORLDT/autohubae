import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import DevelopersList from "./pages/DevelopersList";
import AreasList from "./pages/AreasList";
import Staff from "./pages/admin/Staff";
import Integrations from "./pages/admin/Integrations";
import PortalCalls from "./pages/leads/PortalCalls";
import WhatsappLeads from "./pages/leads/WhatsappLeads";
import WhatsappLogs from "./pages/WhatsappLogs";
import AddLead from "./pages/leads/AddLead";
import EditLead from "./pages/leads/EditLead";
import LeadDetails from "./pages/leads/LeadDetails";
import NewRentProperty from "./pages/properties/rent/NewRentProperty";
import NewSellProperty from "./pages/properties/sell/NewSellProperty";
import LeadsBase from "./pages/leads/LeadsBase";
import NewPropertiesList from "./pages/properties/NewPropertiesList";
import AddProperty from "./pages/properties/AddProperty";
import EditProperty from "./pages/properties/EditProperty";
import AddNewProject from "./pages/newProjects/AddNewProject";
import NewProjectList from "./pages/newProjects/NewProjectList";
import NewProject from "./pages/newProjects/NewProject";
import EditNewProject from "./pages/newProjects/EditNewProject";
import ShareNewSellProperty from "./pages/properties/sell/ShareNewSellProperty";
import ShareNewRentProperty from "./pages/properties/rent/ShareNewRentProperty";
import ShareProject from "./pages/newProjects/ShareProject";
import BayutLeadPortalCalls from "./pages/BayutLeads/BayutLeadPortalCalls";
import BayutLeadsLeads from "./pages/BayutLeads/BayutLeadsLeads";
import BayutWhatsappLeads from "./pages/BayutLeads/BayutWhatsappLeads";
import Teams from "./pages/admin/Teams";
import TeamsTree from "./pages/admin/TeamsTree";
import Calendar from "./pages/calendar/Calendar";
import "bootstrap/dist/css/bootstrap.min.css";
import Watermark from "./pages/admin/Watermark";
import Notifications from "./pages/Notifications";
import DataImport from "./pages/admin/DataImport";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Overview from "./PrivacyPolicy/PrivacyComponent/Overview/Overview";
import TermsAndCondition from "./PrivacyPolicy/PrivacyComponent/TermsAndCondition/TermsAndCondition";
import Privacy from "./PrivacyPolicy/PrivacyComponent/PrivacyPolicy/PrivacyPolicy";
import Cancellation from "./PrivacyPolicy/PrivacyComponent/CancellationANdRefund/CancellationRefund";
import CustSupport from "./PrivacyPolicy/PrivacyComponent/CustSupport/CustSupport";
import About from "./PrivacyPolicy/PrivacyComponent/AboutUs/PAboutUs";
import Pricing from "./PrivacyPolicy/PrivacyComponent/PricingDetails/PricingDetails";
import MapPage from "./ui/MapPage";
// import { PlotMap } from "./ui/PlotList";
import RentProperty from "./features/properties/RentProperty";

import SubscriptionCheck from "./pages/SubscriptionCheck";
import General from "./pages/general/General";
import ManageAreas from "./pages/general/ManageAreas";
import ManageDevelopers from "./pages/general/ManageDevelopers";
import ManageCompany from "./pages/general/ManageCompany";
import ManageCalls from "./pages/general/ManageCalls";
import Subscription from "./pages/general/Subscription";
import XMLFeeds from "./pages/general/XMLFeeds";
import Onboarding from "./pages/Onboarding";
import { SelectedPropertiesProvider } from "./context/SelectedPropertiesContext";
import SmtpSetting from "./pages/general/SmtpSetting";
import Audience from "./pages/Audience";
import FusionMails from "./pages/FusionMails";
import Blog from "./pages/Blog";
import ListOwner from "./pages/Owner/ListOwner";
import ListTenents from "./pages/Tenents/ListTenents";
import AddTenends from "./pages/Tenents/AddTenends";
import TenancyContract from "./pages/Contract/TenancyContracts";
import Contract from "./pages/Contract/Contract";
import Request from "./pages/admin/Request";
import Support from "./pages/general/Support";
import RequestForFeature from "./pages/general/RequestForFeature";
import ReportBug from "./pages/general/ReportBug";
import Updates from "./pages/general/Updates";
import WebApis from "./pages/general/WebApis";
import ReadBlogPage from "./features/Blog/ReadblogPage";
import AddPortalLead from "./pages/leads/AddPortalLead";
import { ManageLeadsInterfaces } from "./pages/general/ManageLeadsInterfaces";
import LeaseContract from "./pages/Contract/LeaseContract";
import PropertyView from "./pages/Contract/PropertyView";
import Owner from "./pages/Contract/Owner";
import EditTenant from "./pages/Tenents/EditTenant";
import DataBase from "./pages/database/DataBase";
import CustomerList from "./pages/database/CustomerList";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GCalendar from "./pages/calendar/GCalendar";
import AgreementTable from "./pages/Contract/AgreementTable";
import AgentContract from "./pages/Contract/AgentContract";
import HrCalendar from "./pages/calendar/HrCalander";
import ChatWidget from "./components/ChatWidget";
import AgentFeed from "./features/feed/AgentFeed";
import PhoneView from "./pages/leads/Phone/PhoneView";
import SmsView from "./pages/leads/Phone/SmsView";
import WhatAppView from "./pages/leads/Phone/WhatAppView";
import Building from "./pages/building/Building";
import AddNewbuilding from "./pages/building/AddNewBuilding";
import BuildingDetail from "./pages/building/DetailPage";
import Watchmen from "./pages/watchmen/Watchmen";
import TenantDetails from "./pages/Tenents/TenantDetails";
import ListRentalAgreements from "./pages/rental-agreement/ListRentalAgreements";
import RentalAgreementDetails from "./pages/rental-agreement/RentalAgreementDetails";
import Whatsapp from "./pages/Whatsapp";
import Transactions from "./pages/Transactions";
import EditNewBuilding from "./pages/building/EditNewBuilding";
import PremiumShareProperty from "./pages/properties/share-premium/PremiumShareProperty";
import WatchmenDetails from "./pages/watchmen/watchmenDetails";
import AddNewVehicle from "./features/vehicles/AddNewVehicle";
import VehiclesList from "./pages/vehicles/Vehicles";
import NewVehicleDetails from "./pages/vehicles/NewVehicleDetails";
import OwnerDetails from "./features/Owner/OwnerDetails";
import EdiNewVehicle from "./features/vehicles/EditNewVehicle";
import VehicleReport from "./pages/vehicles/VehicleReport";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3000, // 0 (adjust as needed)
            cacheTime: 1000, // 24 hours
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            keepPreviousData: true, // Keep showing previous data while fetching new data
            retry: 1,
        },
    },
});
function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
                <SelectedPropertiesProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <BrowserRouter>
                        <Routes>
                            <Route element={<AuthProvider />}>
                                <Route element={<SubscriptionCheck />}>
                                    <Route path="/" element={<AppLayout />}>
                                        <Route
                                            index
                                            element={
                                                <Navigate
                                                    replace
                                                    to="/dashboard"
                                                />
                                            }
                                        />

                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />

                                        <Route
                                            path="/transactions"
                                            element={<Transactions />}
                                        />

                                        <Route path="/developers">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<DevelopersList />}
                                            />
                                        </Route>
                                        <Route path="/areas">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<AreasList />}
                                            />
                                        </Route>
                                        <Route path="/new-projects">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<NewProjectList />}
                                            />
                                            <Route
                                                path="list/:projectId"
                                                element={<NewProject />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddNewProject />}
                                            />
                                            <Route
                                                path="edit/:projectId"
                                                element={<EditNewProject />}
                                            />
                                        </Route>

                                        <Route path="/new-building">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<Building />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddNewbuilding />}
                                            />
                                            <Route
                                                path="list/:id"
                                                element={<BuildingDetail />}
                                            />
                                            <Route
                                                path="edit/:id"
                                                element={<EditNewBuilding />}
                                            />
                                        </Route>

                                        <Route path="/new-watchmen">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<Watchmen />}
                                            />
                                            <Route
                                                path="details/:watchmanId"
                                                element={<WatchmenDetails />}
                                            />
                                        </Route>
                                        <Route path="/for-sell">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            {/* <Route
                                        path="list"
                                        element={
                                            <PropertiesList listingType="SELL" /> 
                                        }
                                    />
                                    <Route
                                        path="list/:propertyId"
                                        element={<SellProperty />}
                                    /> */}
                                            <Route
                                                path="new-list"
                                                element={
                                                    <NewPropertiesList listingType="SELL" />
                                                }
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewSellProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={
                                                    <AddProperty listingType="SELL" />
                                                }
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="SELL" />
                                                }
                                            />
                                        </Route>
                                        <Route path="/rental-agreement">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={
                                                    <ListRentalAgreements />
                                                }
                                            />
                                            <Route
                                                path="list/:id"
                                                element={
                                                    <RentalAgreementDetails />
                                                }
                                            />
                                        </Route>
                                        {/*  Owner Routes */}

                                        <Route path="/for-owner">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="new-list"
                                                element={
                                                    <ListOwner listingType="OWNER" />
                                                }
                                            />
                                            <Route
                                                path="details/:ownerId"
                                                element={<OwnerDetails />}
                                            />
                                        </Route>

                                        <Route path="/for-tenants">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="details/:tenantId"
                                                element={<TenantDetails />}
                                            />

                                            <Route
                                                path="new-list"
                                                element={<ListTenents />}
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewSellProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddTenends />}
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="SELL" />
                                                }
                                            />
                                        </Route>

                                        {/* Customer Routes */}
                                        <Route path="/database">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="list"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="list"
                                                element={<DataBase />}
                                            />
                                            <Route
                                                path="list/customers"
                                                element={<CustomerList />}
                                            />
                                        </Route>

                                        <Route path="/contract">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-contract"
                                                    />
                                                }
                                            />

                                            <Route
                                                path="new-contract"
                                                element={<Contract />}
                                            />
                                            <Route
                                                path="dubai-TenantForm"
                                                element={<TenancyContract />}
                                            />
                                            <Route
                                                path="lease-contract"
                                                element={<LeaseContract />}
                                            />
                                            <Route
                                                path="property-view-contract"
                                                element={<PropertyView />}
                                            />
                                            <Route
                                                path="owner-and-broker"
                                                element={<Owner />}
                                            />
                                            <Route
                                                path="agent-contract"
                                                element={<AgentContract />}
                                            />
                                            <Route
                                                path="agrement-table"
                                                element={<AgreementTable />}
                                            />
                                        </Route>

                                        <Route
                                            path="/vehicles/for-sell"
                                            element={
                                                <VehiclesList listingType="SELL" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-rent"
                                            element={
                                                <VehiclesList listingType="RENT" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/:vehicleId"
                                            element={<NewVehicleDetails />}
                                        />
                                        <Route
                                            path="/vehicles/report/:vehicleId"
                                            element={<VehicleReport />}
                                        />
                                        <Route
                                            path="/vehicles/for-sell/add"
                                            element={
                                                <AddNewVehicle listingType="SELL" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-rent/add"
                                            element={
                                                <AddNewVehicle listingType="RENT" />
                                            }
                                        />
                                        <Route
                                            path="/vehicles/for-sell/edit/:vehicleId"
                                            element={<EdiNewVehicle listingType='SELL' />}
                                        />
                                        <Route
                                            path="/vehicles/for-rent/edit/:vehicleId"
                                            element={<EdiNewVehicle listingType='RENT' />}
                                        />
                                        <Route
                                            path="/propfusion-policies"
                                            element={<PrivacyPolicy />}
                                        >
                                            {/* <Route  element={<PrivacyPolicy/>}/>  */}
                                            <Route
                                                index
                                                element={<Overview />}
                                            />
                                            <Route
                                                path="terms-and-conditions"
                                                element={<TermsAndCondition />}
                                            />
                                            <Route
                                                path="privacy-policy"
                                                element={<Privacy />}
                                            />
                                            <Route
                                                path="cancellation-and-refund-policy"
                                                element={<Cancellation />}
                                            />
                                            <Route
                                                path="customer-support"
                                                element={<CustSupport />}
                                            />
                                            <Route
                                                path="about-us"
                                                element={<About />}
                                            />
                                            <Route
                                                path="pricing-details"
                                                element={<Pricing />}
                                            />
                                        </Route>
                                        <Route path="/for-rent">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="new-list"
                                                    />
                                                }
                                            />
                                            {/* <Route
                                        path="list"
                                        element={
                                            <PropertiesList listingType="RENT" />
                                        }
                                    /> */}
                                            <Route
                                                path="list/:propertyId"
                                                element={<RentProperty />}
                                            />
                                            <Route
                                                path="new-list"
                                                element={
                                                    <NewPropertiesList listingType="RENT" />
                                                }
                                            />
                                            <Route
                                                path="new-list/:propertyId"
                                                element={<NewRentProperty />}
                                            />
                                            <Route
                                                path="add"
                                                element={
                                                    <AddProperty listingType="RENT" />
                                                }
                                            />
                                            <Route
                                                path="edit/:propertyId"
                                                element={
                                                    <EditProperty listingType="RENT" />
                                                }
                                            />
                                        </Route>
                                        <Route path="/leads">
                                            <Route
                                                index
                                                element={
                                                    <Navigate
                                                        replace
                                                        to="sell"
                                                    />
                                                }
                                            />
                                            <Route
                                                path="sell"
                                                element={
                                                    <LeadsBase leadType="SELL" />
                                                }
                                            />
                                            <Route
                                                path="rent"
                                                element={
                                                    <LeadsBase leadType="RENT" />
                                                }
                                            />
                                            <Route
                                                path="undefined"
                                                element={
                                                    <LeadsBase leadType="UNDEFINED" />
                                                }
                                            />
                                            <Route
                                                path="portal-calls"
                                                element={<PortalCalls />}
                                            />
                                            <Route
                                                path="whatsapp-leads"
                                                element={<WhatsappLeads />}
                                            />
                                            <Route
                                                path="phone-view"
                                                element={<PhoneView />}
                                            />
                                            <Route
                                                path="sms-view"
                                                element={<SmsView />}
                                            />
                                            <Route
                                                path="whatsapp-view"
                                                element={<WhatAppView />}
                                            />
                                            <Route
                                                path="details/:leadId"
                                                element={<LeadDetails />}
                                            />
                                            <Route
                                                path="add"
                                                element={<AddLead />}
                                            />
                                            <Route
                                                path="add-portal-lead"
                                                element={<AddPortalLead />}
                                            />
                                            <Route
                                                path="edit/:leadId"
                                                element={<EditLead />}
                                            />
                                        </Route>
                                        <Route path="/bayut-leads">
                                            <Route
                                                path="portal-calls"
                                                element={
                                                    <BayutLeadPortalCalls />
                                                }
                                            />
                                            <Route
                                                path="leads"
                                                element={<BayutLeadsLeads />}
                                            />
                                            <Route
                                                path="whatsapp-leads"
                                                element={<BayutWhatsappLeads />}
                                            />
                                        </Route>
                                        <Route
                                            path="/calendar"
                                            element={<Calendar />}
                                        ></Route>
                                        <Route
                                            path="/gcalendar"
                                            element={<GCalendar />}
                                        ></Route>
                                        <Route
                                            path="/hrcalendar"
                                            element={<HrCalendar />}
                                        ></Route>
                                        <Route
                                            path="/notifications"
                                            element={<Notifications />}
                                        ></Route>
                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        ></Route>
                                        <Route
                                            element={
                                                <ProtectedRoute
                                                    roles={[
                                                        "admin",
                                                        "sales_manager",
                                                        "super_admin",
                                                    ]}
                                                />
                                            }
                                        >
                                            <Route path="/admin">
                                                <Route
                                                    index
                                                    element={
                                                        <Navigate
                                                            replace
                                                            to="staff"
                                                        />
                                                    }
                                                />
                                                <Route
                                                    path="staff"
                                                    element={<Staff />}
                                                />
                                                <Route
                                                    path="requests"
                                                    element={<Request />}
                                                />
                                                <Route
                                                    path="teams"
                                                    element={<Teams />}
                                                />
                                                <Route
                                                    path="teams-tree"
                                                    element={<TeamsTree />}
                                                />
                                                <Route
                                                    path="watermark"
                                                    element={<Watermark />}
                                                />
                                                <Route
                                                    path="Map/:id"
                                                    element={<MapPage />}
                                                ></Route>
                                                <Route
                                                    path="audience"
                                                    element={<Audience />}
                                                ></Route>
                                                <Route
                                                    path="fusionmails"
                                                    element={<FusionMails />}
                                                ></Route>
                                                <Route
                                                    path="blog"
                                                    element={<Blog />}
                                                ></Route>
                                                <Route
                                                    path="blog/:id"
                                                    element={<ReadBlogPage />}
                                                ></Route>
                                                <Route
                                                    path="integrations"
                                                    element={<Integrations />}
                                                />
                                                <Route
                                                    path="data-import"
                                                    element={<DataImport />}
                                                />
                                                <Route path="general">
                                                    <Route
                                                        index
                                                        element={<General />}
                                                    />
                                                    <Route
                                                        path="manage-leads-interfaces"
                                                        element={
                                                            <ManageLeadsInterfaces />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-areas"
                                                        element={
                                                            <ManageAreas />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-developers"
                                                        element={
                                                            <ManageDevelopers />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-company"
                                                        element={
                                                            <ManageCompany />
                                                        }
                                                    />
                                                    <Route
                                                        path="manage-calls"
                                                        element={
                                                            <ManageCalls />
                                                        }
                                                    />
                                                    <Route
                                                        path="xml-feeds"
                                                        element={<XMLFeeds />}
                                                    />
                                                    <Route
                                                        path="smtp-setting"
                                                        element={
                                                            <SmtpSetting />
                                                        }
                                                    />
                                                    <Route
                                                        path="web-apis"
                                                        element={<WebApis />}
                                                    />
                                                    <Route
                                                        path="updates"
                                                        element={<Updates />}
                                                    />
                                                    <Route
                                                        path="report-bug"
                                                        element={<ReportBug />}
                                                    />
                                                    <Route
                                                        path="request-feature"
                                                        element={
                                                            <RequestForFeature />
                                                        }
                                                    />
                                                    <Route
                                                        path="support"
                                                        element={<Support />}
                                                    />
                                                    <Route
                                                        path="subscription"
                                                        element={
                                                            <Subscription />
                                                        }
                                                    />
                                                </Route>
                                            </Route>
                                        </Route>
                                        <Route
                                            path="/feed"
                                            element={<AgentFeed />}
                                        />
                                        <Route
                                            path="/whatsapp-logs"
                                            element={<WhatsappLogs />}
                                        />
                                        <Route
                                            path="/whatsapp"
                                            element={<Whatsapp />}
                                        />
                                    </Route>
                                </Route>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/onboarding"
                                    element={<Onboarding />}
                                />
                            </Route>

                            <Route
                                path="/share-project/:projectId"
                                element={<ShareProject />}
                            />

                            {/* <Route
                        path="/share-property/sell/:propertyId"
                        element={<ShareSellProperty />}
                    />
                    <Route
                        path="/share-property/rent/:propertyId"
                        element={<ShareRentProperty />}
                    /> */}

                            <Route
                                path="/share-new-property/sell/:propertyId"
                                element={<ShareNewSellProperty />}
                            />
                            <Route
                                path="/share-new-property/rent/:propertyId"
                                element={<ShareNewRentProperty />}
                            />
                            <Route
                                path="/share-premium/:listingType/:propertyId"
                                element={<PremiumShareProperty />}
                            />

                            <Route
                                path="/tenants/:tenantId/edit"
                                element={<EditTenant />}
                            />

                            <Route
                                path="/transactions"
                                element={<Transactions />}
                            />

                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>

                    <Toaster
                        position="top-center"
                        gutter={12}
                        containerStyle={{ margin: "8px" }}
                        toastOptions={{
                            success: {
                                duration: 3000,
                            },
                            error: {
                                duration: 5000,
                            },
                            style: {
                                fontSize: "18px",
                                padding: "14px 24px",
                                backgroundColor: "var(--clr-neutral-50)",
                                color: "var(--clr-neutral-500)",
                            },
                        }}
                    />
                    <ChatWidget />
                </SelectedPropertiesProvider>
            </QueryClientProvider>
        </DndProvider>
    );
}

export default App;
