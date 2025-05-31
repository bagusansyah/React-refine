import { useGetIdentity } from "@refinedev/core";
import { Avatar as AntdAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
  name: string;
};
const CustomAvatar = ({ name, style, ...rest }: Props) => {
  const { data: user } = useGetIdentity();
  return (
    <AntdAvatar
      alt="'JavaScript Mastery"
      size="small"
      style={{
        backgroundColor: "#87d068",
        display: "flex",
        alignItems: "center",
        border: "none",
      }}
    >
      {name}
    </AntdAvatar>
  );
};

export default CustomAvatar;
