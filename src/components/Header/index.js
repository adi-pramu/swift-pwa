import React from 'react';
import { Button } from '@material-ui/core';
import { ArrowBack, Close as CloseIcon } from '@material-ui/icons';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Typography from '@components/Typography';
import useStyles from './style';

const Header = ({
    LeftComponent,
    CenterComponent,
    RightComponent,
    className = {},
    pageConfig = {
        header: 'relative',
    },
}) => {
    const styles = useStyles();
    const route = useRouter();
    const back = () => {
        route.back();
    };

    if (pageConfig && !pageConfig.header) return null;

    const position = pageConfig && pageConfig.header === 'absolute'
        ? styles.headerAbsolute
        : styles.headerRelative;

    const containerStyle = classNames(styles.container, position, className);
    return (
        <header className={containerStyle}>
            <div className={styles.leftContainer}>
                {React.isValidElement(LeftComponent) ? (
                    LeftComponent
                ) : (
                    <Button
                        onClick={
                            (LeftComponent
                                && LeftComponent.onClick
                                && LeftComponent.onClick)
                            || back
                        }
                        className={styles.btnBack}
                    >
                        {pageConfig.headerBackIcon && pageConfig.headerBackIcon === 'close' ? (
                            <CloseIcon className={styles.backIcon} />
                        ) : (
                            <ArrowBack className={styles.backIcon} />
                        )}
                    </Button>
                )}
            </div>
            <div className={styles.centerContainer}>
                {React.isValidElement(CenterComponent) ? (
                    CenterComponent
                ) : (
                    <>
                        {pageConfig.headerTitle ? (
                            <Typography
                                variant="h1"
                                type="bold"
                                letter="uppercase"
                                align="center"
                                className={styles.title}
                            >
                                {pageConfig.headerTitle}
                            </Typography>
                        ) : null}
                    </>
                )}
            </div>
            <div className={styles.rightContainer}>
                {React.isValidElement(RightComponent) ? RightComponent : null}
            </div>
        </header>
    );
};

export default Header;