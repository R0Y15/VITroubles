export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    imgURL: "/assets/community.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export interface updateUserProps {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export interface ThreadProps {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export interface ThreadCardProps {
  id: string,
  currentuser: string | undefined,
  parentId: string | null,
  content: string,
  author: {
    id: string,
    name: string,
    image: string,
  },
  community: {
    id: string,
    name: string,
    image: string,
  } | null,
  createdAt: string,
  comments: {
    author: {
      image: string
    }
  }[],
  isComment?: boolean
}

export interface CommentProps {
  threadId: string,
  userImg: string,
  userId: string
}

export interface ProfileHeaderProps {
  accountId: string,
  authUserId: string,
  name: string,
  username: string,
  avatar: string,
  bio: string,
  type?: 'community' | 'user'
}

export interface ThreadsTabProps {
  currentUserId: string,
  accountId: string,
  accountType: string
}

export interface UserCardProps {
  key: string,
  id: string,
  name: string,
  username: string,
  image: string,
  personType: string
}

export interface CommunityCardProps {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  members: {
    image: string;
  }[];
}