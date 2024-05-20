"use client";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createMember } from "../../actions";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";

const createFormSchema = z
	.object({
		name: z.string().min(2, {
			message: "Username must be at least 2 characters.",
		}),
		role: z.enum(["user", "admin"]),
		status: z.enum(["active", "unActive"]),
		email: z.string().email(),
		password: z
			.string()
			.min(6, { message: "Password should be 6 characters" }),
		confirm: z
			.string()
			.min(6, { message: "Password should be 6 characters" }),
	})
	.refine((data) => data.confirm === data.password, {
		message: "Passowrd doesn't match",
		path: ["confirm"],
	});

export type CreateFormSchema = z.infer<typeof createFormSchema>


export default function MemberForm() {
	const roles = ["admin", "user"];
	const status = ["active", "unActive"];
	const [isPending, startTransaction] = useTransition()
	const { toast } = useToast()
	const form = useForm<CreateFormSchema>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			name: "",
			role: "user",
			status: "active",
			email: "",
		},
	});

	const onSubmit = (data: CreateFormSchema) => {
		startTransaction(async () => {
			try {
				const result = await createMember(data);
				toast({
					title: 'success createUser'
				})
			} catch (e) {
				if (e instanceof Error) {
					toast({
						title: 'failed createUser',
						description: e.message
					})
				}
			}
		})

	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="email@gmail.com"
									type="email"
									{...field}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									placeholder="******"
									type="password"
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									placeholder="******"
									type="password"
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="display name"
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{roles.map((role, index) => {
										return (
											<SelectItem
												value={role}
												key={index}
											>
												{role}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select user status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{status.map((status, index) => {
										return (
											<SelectItem
												value={status}
												key={index}
											>
												{status}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							<FormDescription>
								status unActive mean the user is blocked account.
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full flex gap-2 items-center"
					variant="outline"
					disabled={isPending}
				>
					Submit{" "}
					<AiOutlineLoading3Quarters
						className={cn("animate-spin", { hidden: !isPending })}
					/>
				</Button>
			</form>
		</Form>
	);
}
