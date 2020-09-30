import noReload from '@helper_noreload';
import { useRouter } from 'next/router';
import { setResolver } from '@helper_localstorage';
import { getCmsBlocks } from '../../../services/graphql';

const Footer = (props) => {
    const {
        Content, t, storeConfig,
    } = props;
    const {
        data, loading, error,
    } = getCmsBlocks({ identifiers: ['pwa_footer'] });
    const router = useRouter();
    const Config = {
        title: data && data.cmsBlocks ? data.cmsBlocks.title : '',
        headerTitle: data && data.cmsBlocks ? data.cmsBlocks.title : '',
        bottomNav: false,
        header: 'relative', // available values: "absolute", "relative", false (default)
    };

    const linkAction = async (type, link) => {
        if (type === 'cms') {
            await setResolver({
                type: 'CMS_PAGE',
            });
            router.push('/[...slug]', link);
        } else {
            router.push('/[...slug]', link);
        }
    };

    React.useEffect(() => {
        noReload({
            action: linkAction,
        });
    }, [router.asPath]);
    return (
        <Content
            data={data}
            {...Config}
            t={t}
            loading={loading}
            error={error}
            storeConfig={storeConfig}
        />
    );
};

export default Footer;
