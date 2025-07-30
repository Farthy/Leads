import { uniqueId } from "lodash";
import { EmailOutlined, Person3, PersonAddAltOutlined, RoomServiceOutlined, SmsOutlined, SupervisedUserCircle } from "@mui/icons-material";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Overview",
    icon: Person3,
    href: "/dashboards/ecommerce",
  },
  {
    id: uniqueId(),
    title: "Leads",
    icon: PersonAddAltOutlined,
    href: "/dashboards/leads",
  },
  {
    id: uniqueId(),
    title: "Operations",
    icon: RoomServiceOutlined,
    href: "/dashboards/operations",
  },
  {
    id: uniqueId(),
    title: "Messages",
    icon: SmsOutlined,
    href: "/dashboards/sms",
  },
  {
    id: uniqueId(),
    title: "Emails",
    icon: EmailOutlined,
    href: "/dashboards/emails",
  },
  {
    id: uniqueId(),
    title: "Users",
    icon: SupervisedUserCircle,
    href: "/dashboards/users",
  },


];

export default Menuitems;
