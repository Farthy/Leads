import Image from "next/image";
import { Box } from '@mui/material';

const Logo2 = () => {

    return (
      <Box href="/">
          <Image
            src={"/images/logos/dark-logo.png"}
            alt="logo"
            height={140}
            width={144}
            priority
          />
      
      </Box>
    );
  }


export default Logo2;
