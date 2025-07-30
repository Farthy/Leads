import Image from "next/image";
import { Box } from '@mui/material';

const Logo = () => {

    return (
      <Box mt={3} href="/">
          <Image
            src={"/images/logos/dark-logo.png"}
            alt="logo"
            height={190}
            width={174}
            priority
          />
      
      </Box>
    );
  }


export default Logo;
