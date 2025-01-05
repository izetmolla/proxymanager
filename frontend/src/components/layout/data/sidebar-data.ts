import {
    IconLayoutDashboard,
    IconKey,
    IconServer2,
    IconLoadBalancer,
    IconUserCog,
    IconLogs,
    IconSettings,
    IconMailCog,
    IconLock,
    IconActivity

} from '@tabler/icons-react'
import { type SidebarData } from '../types'
import { SiNginx } from "react-icons/si";
import { AiTwotoneApi } from "react-icons/ai";
import { Command } from '@/components/ui/command';
import { BsFiletypeHtml } from "react-icons/bs";



export const sidebarData: SidebarData = {
    teams: [
        {
            name: 'Shadcn Admin',
            logo: Command,
            plan: 'Vite + ShadcnUI',
        },
    ],
    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/',
                    icon: IconLayoutDashboard,
                },
                {
                    title: 'Proxy Manager',
                    url: '/proxy-manager',
                    icon: IconServer2,
                },
                {
                    title: 'SSL Certificates',
                    url: '/ssl-manager',
                    icon: IconKey,
                },
                {
                    title: 'Upstreams',
                    url: '/upstreams',
                    icon: IconLoadBalancer,
                },
                {
                    title: 'Access Lists',
                    url: '/access-list',
                    icon: IconLock,
                },
                {
                    title: 'Uptime Status',
                    url: '/uptime',
                    icon: IconActivity,
                },

            ],
        },
        {
            title: 'Settings',
            items: [
                {
                    title: 'Users',
                    url: '/users',
                    icon: IconUserCog,
                },
                {
                    title: 'Api Settings',
                    url: '/api-settings',
                    icon: AiTwotoneApi,
                },
                {
                    title: 'Logs Settings',
                    url: '/logs-settings',
                    icon: IconLogs,
                },
                {
                    title: 'Notifications',
                    url: '/notifications-settings',
                    icon: IconMailCog,
                },
                {
                    title: 'Nginx Settings',
                    icon: SiNginx,
                    items: [
                        {
                            title: 'General',
                            url: '/nginx-settings',
                        },
                        {
                            title: 'Main File Editor',
                            url: '/nginx-settings/mainfile-edit',
                        },
                    ]
                },
                {
                    title: 'Static Files',
                    url: '/templates',
                    icon: BsFiletypeHtml,
                },
                {
                    title: 'General',
                    url: '/general-settings',
                    icon: IconSettings,
                },
            ]
        }

    ],
}
