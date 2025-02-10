import Link from "next/link";
import { Button } from "./ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

type Post = {
  author: string;
  id: string;
  createdAt: Date;
  title: string;
  price: string;
  quota: string;
  description: string;
};

const Card = ({ post }: { post: Post }) => {
  return (
    <div>
      <li className="startup-card group">
        <div className="flex-between">
          <p className="startup_card_date ">
            {formatDate(String(post.createdAt))}
          </p>
        </div>

        <div className="flex-between mt-5 gap-5">
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-16-medium line-clamp-1">{post.author}</p>
              <p className="text-16-medium line-clamp-1">{`${post.quota} Kg`}</p>
            </div>
            <h3 className="text-26-semibold line-clamp-1">{post.title}</h3>

            <p className="startup-card_desc">{post.description}</p>
            <div className="flex-between gap-3 mt-5">
              <p className="text-16-medium">{`${formatPrice(
                Number(post.price)
              )}`}</p>
              <Button className="startup-card_btn" asChild>
                <Link href={`/detail/${post.id}`}>Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Card;
