import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AdminCourseManagement from './AdminCourseManangement';
import TeacherDashboard from './TeacherDashboard';
import StudentCourseDetail from './StudentCourseDetail';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'courses',
    title: 'Courses',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'students',
    title: 'Students',
    icon: <PeopleIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'admin',
    title: 'Admin',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'students',
    title: 'students',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'teacher',
    title: 'Teacher',
    icon: <ShoppingCartIcon />,
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const renderContent = () => {
    switch (pathname) {
      case '/dashboard':
        return <Typography variant="h4">Welcome to the Dashboard</Typography>;
      case '/courses':
        return <Typography variant="h4">Manage your Courses</Typography>;
      case '/orders':
        return <Typography variant="h4">Manage Orders</Typography>;
      case '/admin':
        return <AdminCourseManagement/>
      case '/teacher':
        return <TeacherDashboard/>
      case '/students':
        return <StudentCourseDetail/>
      default:
        return <Typography variant="h4">Page Not Found</Typography>;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {renderContent()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutBranding.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
