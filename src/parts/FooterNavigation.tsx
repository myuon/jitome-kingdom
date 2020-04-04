import React, { useCallback, useMemo } from "react";
import { css } from "@emotion/core";
import {
  Hidden,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Paper
} from "@material-ui/core";
import RestoreIcon from "@material-ui/icons/Restore";
import PersonIcon from "@material-ui/icons/Person";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import { useRouter } from "next/router";

export const FooterNavigation: React.FC<{ giftBadge?: number }> = props => {
  const router = useRouter();
  const navigationValue = useMemo(() => {
    switch (router.route) {
      case "/dashboard":
        return 1;
      case "/changelog":
        return 2;
      case "/gift":
        return 0;
    }
  }, [router]);
  const handleChange = useCallback(
    (_, newValue) => {
      if (newValue === 0) {
        router.push("/gift");
      } else if (newValue === 1) {
        router.push("/dashboard");
      } else if (newValue === 2) {
        router.push("/changelog");
      }
    },
    [router]
  );

  return (
    <footer
      css={css`
        width: 100%;
        position: fixed;
        bottom: 0;
      `}
    >
      <Hidden smUp>
        <Paper elevation={3}>
          <BottomNavigation
            showLabels
            value={navigationValue}
            onChange={handleChange}
          >
            <BottomNavigationAction
              label="プレゼント"
              icon={
                <Badge badgeContent={props.giftBadge ?? 0} color="primary">
                  <CardGiftcardIcon />
                </Badge>
              }
            />
            <BottomNavigationAction label="マイページ" icon={<PersonIcon />} />
            <BottomNavigationAction label="更新履歴" icon={<RestoreIcon />} />
          </BottomNavigation>
        </Paper>
      </Hidden>
    </footer>
  );
};
