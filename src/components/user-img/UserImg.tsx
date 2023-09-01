import { toSvg } from "jdenticon/standalone";
import { useAtom } from "jotai";

import Styles from "@/components/user-img/UserImg.module.scss";
import { userImgCacheAtom } from "@/context/userImgCache";

type props = {
  userId: string;
};

const UserImg = ({ userId }: props) => {
  const [userImgCache, setUserImgCache] = useAtom(userImgCacheAtom);
  if (userImgCache[userId])
    return (
      <img src={userImgCache[userId]} alt={userId} className={Styles.img} />
    );
  const size = 200;
  const svg = `data:image/svg+xml;,${encodeURIComponent(toSvg(userId, size))}`;
  setUserImgCache({ ...userImgCache, [userId]: svg });
  return <img src={svg} alt={userId} className={Styles.img} />;
};

export { UserImg };
